<?php

namespace App\Data;

use DateTime;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class UserData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        #[Email, Unique]
        public string $email,
        public DateTime $email_verified_at,
        public string $password,
        public string $remember_token,
        public DateTime $created_at,
        public DateTime $updated_at,
        public int $role_id
    ) {}
}
