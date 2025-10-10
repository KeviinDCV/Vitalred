<?php

namespace App\Policies;

use App\Models\SolicitudIps;
use App\Models\User;

class SolicitudIpsPolicy
{
    public function update(User $user, SolicitudIps $solicitud): bool
    {
        return $user->id === $solicitud->user_id || $user->isAdministrator();
    }

    public function delete(User $user, SolicitudIps $solicitud): bool
    {
        return $user->id === $solicitud->user_id || $user->isAdministrator();
    }
}