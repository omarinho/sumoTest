@extends('layouts.app')

@section('content')
    <div class="row justify-content-center">
        <div class="col-md-8">
			@if ($emailCreated == 'yes')
				<div class="alert alert-success" role="alert">
  					The email has been saved successfully!
				</div>
			@endif
            <div class="title m-b-md">
          		<div>
                	<div class="justify-content-center">
                    	<div >
                        	<div class="card">
                            	<div class="card-header"><h1>Saved emails list</h1></div>
                            	<div>
                            		<table class="table">
  										<thead>
    										<tr>
    											<th scope="col">Subject</th>
    											<th scope="col">Creator</th>
      											<th scope="col">Created at</th>
      											<th scope="col">Updated at</th>
      											<th scope="col">Actions</th>
    										</tr>
  										</thead>
  										<tbody>
  											@if ( count($emails) > 0 )
  												@foreach ($emails as $email)
    												<tr>
      													<td>{{$email->subject}}</th>
      													<td>{{$email->user->name}}</td>
      													<td>{{$email->created_at}}</td>
      													<td>{{$email->updated_at}}</td>
      													<td>
      														<a href="{{ route('show', $email->id) }}">Edit</a> | <a href="javascript:void(0)" onClick="if (confirm('Are you sure?')) { window.location='{{ route('delete', $email->id) }}' }">Delete</a>
      													</td>
    												</tr>
    											@endforeach
    										@else 
	    										<tr>
	    											<td colspan="5">
    													<div class="row">
    														<div class="col-3 mx-auto">
        														<div class="text-center">
        															<b>No emails found.</b>
        															<br/>
        															<a href="{{ route('create_email') }}">Create the first one now.</a></b>
        														</div>
        													</div>
        												</div>
    												</td>
    											</tr>
    										@endif
    										<tr>
    											<td colspan="5">
    												<div class="row">
    													<div class="col-3 mx-auto">
        													<div class="text-center">
            													{{ $emails->links() }}
        													</div>
    													</div>
													</div>
    											</td>
    										</tr>
  										</tbody>
									</table>
                            	</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
