<?php

namespace App\Enum;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
enum PowerupTypes: string
{
    case ATTACK = 'Attack';

    case DEFENSE = 'Defense';

    case SPEED = 'Speed';

    case FIRERATE = 'FireRate';

    case HEAL = 'Heal';

    case HEALTH = 'Health';
}
