<?php

namespace App\Data;

use App\Enum\Roles;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class RoleData extends Data
{
    public function __construct(
        public int $id,
        public Roles $name
    ) {}
}
