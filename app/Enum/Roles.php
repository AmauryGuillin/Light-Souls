<?php

namespace App\Enum;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
enum Roles: string
{
    case USER = 'User';

    case DEVELOPPER = "Developper";
}
