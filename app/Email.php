<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Email extends Model
{
	protected $fillable = ['subject', 'body', 'user_id'];
	
	public function user(){
		return $this->belongsTo(User::class);
	}	

}
