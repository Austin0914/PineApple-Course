<?php

namespace App\Http\Controllers;

use App\Models\UserRegiter;
use App\Models\Users;
use App\Models\Departments;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;

class UsersController extends Controller
{
    // [Auth] POST users/
    // 建立一個帳號密碼
    public function create(Request $request)
    {
        try{
            $data = $request->validate([
                'username' => 'required|string|max:50|unique:user_regiters',
                'password' => 'required|string|confirmed',
                'password_confirmation' => 'required|string',
            ]);

            $user = UserRegiter::create([
                'username' => $data['username'],
                'password' => $data['password'],
            ]);

            Cookie::queue('userID', $user->user_id, 60, null, null, false, false);

            return response()->json([
                'message' => 'User created successfully',
                'user' => [
                    'userID' => $user->user_id,
                ]
            ], 201);
        }catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation error', 'errors' => $e->errors()], 422);
        }catch (\Illuminate\Database\QueryException $e) {
            if ($e->errorInfo[1] == 1062) { // MySQL duplicate entry error code
            return response()->json(['message' => 'Username already exists'], 409);
            }
            return response()->json(['message' => 'Database error: ' . $e->getMessage()], 500);
        }catch (\Exception $e) {
            return response()->json(['message' => 'Error creating user: ' . $e->getMessage()], 500);
        }
    }

    // [Auth] POST users/{user_id}
    // 更新使用者資訊
    public function update(Request $request, $user_id)
    {
        try {
            $userExists = UserRegiter::where('user_id', $user_id)->exists();
            if (!$userExists) {
                return response()->json(['message' => 'User not found'], 404);
            }
            
            $data = $request->validate([
                'public_number' => 'required|string|max:50',
                'name' => 'required|string|max:100',
                'depart_name' => 'nullable|max:100',
                'grade' => 'nullable|integer|min:1|max:6',
                'role' => 'required|in:student,teacher,admin',
            ]);
            
            if(isset($data['depart_name'])){
                $depart = Departments::where('depart_name', $data['depart_name'])->first();
                if (!$depart) {
                    return response()->json(['message' => 'Department not found'], 404);
                }
            }
            
            $user = Users::create([
                'user_id' => $user_id,
                'public_number' => $data['public_number'],
                'name' => $data['name'],
                'depart_id' => $depart->depart_id ?? null,
                'grade' => $data['grade'] ?? null,
                'role' => $data['role'],
            ]);

            return response()->json(['message' => 'User updated successfully'], 204);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'User not found'], 404);
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->errorInfo[1] == 1062) { // MySQL duplicate entry error code
            return response()->json(['message' => 'User information already exists'], 409);
            }
            return response()->json(['message' => 'Database error',$e->getMessage()], 500);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error updating user: ' . $e->getMessage()], 500);
        }
    }
}
