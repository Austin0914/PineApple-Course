<?php

namespace App\Http\Controllers;

use App\Models\Announcements;
use App\Models\Sessions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\QueryException;
use Exception;

class AnnouncementsController extends Controller
{
    //[Announcements] GET /announcements
    //找所有公告，time為true時，找有代表找時間軸，否則找普通公告
    public function index(Request $request)
    {
        try {
            if ($request->time == 'true') {
                $announcements = Announcements::whereNotNull('end_date')->latest()->get();
            } else {
                $announcements = Announcements::whereNull('end_date')->latest()->get();
            }
            return response()->json([
                'message' => 'Get Announcements successful',
                'data' => $announcements->map(function ($announcement) {
                    return [
                        'announceId' => $announcement->announce_id,
                        'title' => $announcement->title,
                        'content' => $announcement->content,
                        'announceDate' => $announcement->announce_date,
                        'endDate' => $announcement->end_date,
                    ];
                })
            ], 200);
        } catch (QueryException $e) {
            return response()->json(['message' => 'Database error when retrieving announcements.', 'error' => $e->getMessage()], 500);
        } catch (Exception $e) {
            return response()->json(['message' => 'An unexpected error occurred.', 'error' => $e->getMessage()], 500);
        }
    }

    //[Announcements] POST /announcements
    //新增公告
    public function store(Request $request)
    {
        try {
            $userID = $request->userID;
            $data = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'announce_date' => 'required|date',
                'end_date' => 'nullable|date|after_or_equal:announce_date',
            ]);

            $announcement = Announcements::create([
                'title' => $data['title'],
                'content' => $data['content'],
                'announce_date' => $data['announce_date'],
                'end_date' => $data['end_date'] ?? null,
                'announcer_id' => $userID,
            ]);

            return response()->json(null, 204);

        } catch (ValidationException $e) {
            return response()->json(['message' => 'Validation error', 'errors' => $e->errors()], 422);
        } catch (QueryException $e) {
            return response()->json(['message' => 'Database error creating announcement.', 'error' => $e->getMessage()], 500);
        } catch (Exception $e) {
            return response()->json(['message' => 'Error creating announcement.', 'error' => $e->getMessage()], 500);
        }
    }

    //[Announcements] GET /announcements/{announcementId}
    //查詢特定公告
    public function show(string $announcementId)
    {
        try {
            
            $announcement = Announcements::find($announcementId);

            if (!$announcement) {
                return response()->json(['message' => 'Announcement not found'], 404);
            }

            return response()->json([
                'message' => 'Get Announcements successful',
                'data' =>  [
                        'announceId' => $announcement->announce_id,
                        'title' => $announcement->title,
                        'content' => $announcement->content,
                        'announceDate' => $announcement->announce_date,
                        'endDate' => $announcement->end_date,
                    ]
            ], 200);
        } catch (QueryException $e) {
            return response()->json(['message' => 'Database error retrieving announcement.', 'error' => $e->getMessage()], 500);
        } catch (Exception $e) {
            return response()->json(['message' => 'An unexpected error occurred.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     * PATCH /announcements/{announcementId}
     */
    public function update(Request $request, string $announcementId)
    {
        try {
            $userID = $request->userID;
            $announcement = Announcements::find($announcementId);
            if (!$announcement) {
                return response()->json(['message' => 'Announcement not found'], 404);
            }

            $data = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'announce_date' => 'required|date',
                'end_date' => 'nullable|date|after_or_equal:announce_date',
            ]);

            $announcement->update([
                'title' => $data['title'],
                'content' => $data['content'],
                'announce_date' => $data['announce_date'],
                'end_date' => $data['end_date'] ?? null,
                'announcer_id' => $userID,
            ]);

            return response()->json(null, 204);

        } catch (ValidationException $e) {
            return response()->json(['message' => 'Validation error', 'errors' => $e->errors()], 422);
        } catch (QueryException $e) {
            return response()->json(['message' => 'Database error updating announcement.', 'error' => $e->getMessage()], 500);
        } catch (Exception $e) {
            return response()->json(['message' => 'Error updating announcement.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     * DELETE /announcements/{announcementId}
     */
    public function destroy(string $announcementId)
    {
        try {
            $announcement = Announcements::find($announcementId);

            if (!$announcement) {
                return response()->json(['message' => 'Announcement not found'], 404);
            }

            $announcement->delete();

            return response()->json(null, 204);
        } catch (QueryException $e) {
            return response()->json(['message' => 'Database error deleting announcement.', 'error' => $e->getMessage()], 500);
        } catch (Exception $e) {
            return response()->json(['message' => 'Error deleting announcement.', 'error' => $e->getMessage()], 500);
        }
    }
}
