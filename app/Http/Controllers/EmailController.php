<?php

namespace App\Http\Controllers;

use App\Email;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EmailController extends Controller
{

  public function __construct()
  {
    $this->middleware('auth');
  }

	public function list(Request $request)
	{
    $emails = Email::orderBy('created_at', 'desc')->paginate( env("RECORDS_PER_PAGE", 3) );
    $data = [
              "emailCreated" => $request->get('emailCreated', ''),
              "emails" => $emails,
            ];
    return view("home", $data);
	}

  public function create()
  {
    return view('create_email');
  }

	public function store(Request $request)
	{
    $email = Email::create([
      'subject' => $request->input('subject'),
      'body' => $request->input('content'),
      'user_id' => Auth::id(),
    ]);
    return response()->json([
      'success' => 'yes'
    ]);
	}

	public function show(Request $request, int $id)
	{
    $data = ["id" => $id];
    return view("show", $data);
	}

  public function get(Request $request, int $id)
  {
    $email = Email::find($id);
    return response()->json([
      'success' => 'yes',
      'data' => $email,
    ]);
  }

  public function update(Request $request, int $id)
  {
    $email = Email::find($id);
    $email->subject = $request->input('subject');
    $email->body = $request->input('content');
    $email->save();
    return response()->json([
      'success' => 'yes',
    ]);
  }

  public function delete(Request $request, int $id)
  {
    $email = Email::find($id);
    $email->delete();
    return redirect()->route('home');
  }

}
