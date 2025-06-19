<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Sessions; 

class ValidateUserSession
{
    public function handle(Request $request, Closure $next): Response
    {
        $accessToken = $request->cookie('accessToken');
        if (!$accessToken || !Sessions::refreshOrDelete($accessToken, 30)) {
            return response()->json(['message' => 'Session expired or invalid'], 401);
        }

        $userID = $request->cookie('userID');

        if (!$userID) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        // 將 userID 加入到 request 中，讓 controller 可以取得
        $request->merge(['userID' => $userID]);
        
        return $next($request);
    }
}
