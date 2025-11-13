<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'ips_id',
        'ips_nombre',
        'nit',
        'nombre_responsable',
        'cargo_responsable',
        'telefono',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Check if user is administrator
     */
    public function isAdministrator(): bool
    {
        return $this->role === 'administrador';
    }

    /**
     * Check if user is medico
     */
    public function isMedico(): bool
    {
        return $this->role === 'medico';
    }

    /**
     * Check if user is IPS
     */
    public function isIps(): bool
    {
        return $this->role === 'ips';
    }

    /**
     * Check if user is active
     */
    public function isActive(): bool
    {
        return $this->is_active;
    }

    /**
     * Relación con la institución (IPS)
     */
    public function institucion()
    {
        return $this->belongsTo(Institucion::class, 'ips_id');
    }
}
