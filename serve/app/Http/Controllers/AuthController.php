<?php

namespace App\Http\Controllers;

use App\Models\UserRegiter;
use App\Models\Users;
use App\Models\Sessions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Exception;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // [Auth] POST /sessions
    // 使用者登入
    public function login(Request $request)
    {
        try{
            $data = $request->validate([
                'username' => 'required|string|max:50',
                'password' => 'required|string|max:256',
            ]);

            $user = UserRegiter::where('username', $data['username'])->first();

            if (!$user || !$user->verifyPassword($data['password'])) {
                return response()->json(['message' => 'Invalid username or password'], 401);
            }

            // 對應到user，並在建立 session 前先檢查 user 是否存在
            $userInfo = $user->users;
            
            if (!$userInfo) {
                return response()->json(['message' => 'User information not found'], 404);
            }

            // 建立session
            $session = Sessions::createForUser($user->user_id);

            // 登入成功，設定 cookie
            Cookie::queue('accessToken', $session->access_token, 60, null, null, false, false);
            Cookie::queue('userID', $user->user_id, 60, null, null, false, false);

            // 對應到user
            $userInfo = $user->users;
            
            return response()->json([
                'message' => 'Login successful',
                'user' => [
                    'role' => $userInfo->role,
                    'name' => $userInfo->name,
                    'public_number' => $userInfo->public_number,
                ]
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred during login',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // [Auth] DELETE /sessions
    // 使用者登出
    public function logout(Request $request)
    {
        try {
            // 從 cookie 中獲取 access_token 和 user_id
            $accessToken = $request->cookie('accessToken');
            $userId = $request->cookie('userID');

            if ($accessToken) {
                Sessions::where('access_token', $accessToken)->delete();
            }

            // 清除 cookies
            $response = response()->json(['message' => 'Logout successful'], 200);
            $response->withoutCookie('accessToken');
            $response->withoutCookie('userID');

            return $response;
        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred during logout',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}