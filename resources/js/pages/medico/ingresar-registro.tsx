import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { Edit, Calendar, Upload, ChevronRight, X } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ingresar Registro',
        href: '/medico/ingresar-registro',
    },
];

// Códigos CIE-10 - se cargan dinámicamente desde JSON

// Datos para los selects - Sistema de Salud Colombiano
const aseguradores = [
    { value: 'adres', label: 'ADRES' },
    { value: 'arl', label: 'ARL' },
    { value: 'eps', label: 'EPS' },
    { value: 'particular', label: 'PARTICULAR' },
    { value: 'secretaria_salud_departamental', label: 'SECRETARIA DE SALUD DEPARTAMENTAL' },
    { value: 'secretaria_salud_distrital', label: 'SECRETARIA DE SALUD DISTRITAL' },
    { value: 'soat', label: 'SOAT' },
];

// Selectores secundarios para aseguradores
const arlOptions = [
    { value: 'arl_positiva', label: 'ARL Positiva' },
    { value: 'seguros_bolivar', label: 'Seguros Bolívar S.A' },
    { value: 'seguros_vida_aurora', label: 'Seguros de Vida Aurora S.A' },
    { value: 'liberty_seguros', label: 'Liberty Seguros de Vida' },
    { value: 'mapfre_colombia_vida', label: 'Mapfre Colombia Vida Seguros S.A.' },
    { value: 'riesgos_laborales_colmena', label: 'Riesgos Laborales Colmena' },
    { value: 'seguros_vida_alfa', label: 'Seguros de Vida Alfa S.A' },
    { value: 'seguros_vida_colpatria', label: 'Seguros de Vida Colpatria S.A' },
    { value: 'seguros_vida_equidad', label: 'Seguros de Vida la Equidad Organismo C.' },
    { value: 'sura_suramericana', label: 'Sura - Cia. Suramericana de Seguros de Vida' },
];

const epsOptions = [
    { value: 'regional_aseguramiento_policia', label: 'REGIONAL DE ASEGURAMIENTO EN SALUD NO. 4 (POLICÍA)' },
    { value: 'fomag', label: 'FONDO NACIONAL DE PRESTACIONES SOCIALES DEL MAGISTERIO (FOMAG)' },
    { value: 'sanidad_emavi', label: 'SANIDAD ESCUELA MILITAR DE AVIACIÓN (EMAVI)' },
    { value: 'coosalud_eps', label: 'COOSALUD EPS-S' },
    { value: 'nueva_eps', label: 'NUEVA EPS' },
    { value: 'mutual_ser', label: 'MUTUAL SER' },
    { value: 'aliansalud_eps', label: 'ALIANSALUD EPS' },
    { value: 'salud_total_eps', label: 'SALUD TOTAL EPS S.A.' },
    { value: 'eps_sanitas', label: 'EPS SANITAS' },
    { value: 'eps_sura', label: 'EPS SURA' },
    { value: 'famisanar', label: 'FAMISANAR' },
    { value: 'servicio_occidental_salud', label: 'SERVICIO OCCIDENTAL DE SALUD EPS SOS' },
    { value: 'salud_mia', label: 'SALUD MIA' },
    { value: 'comfenalco_valle', label: 'COMFENALCO VALLE' },
    { value: 'compensar_eps', label: 'COMPENSAR EPS' },
    { value: 'epm_medellin', label: 'EPM - EMPRESAS PUBLICAS DE MEDELLIN' },
    { value: 'fondo_pasivo_ferrocarriles', label: 'FONDO DE PASIVO SOCIAL DE FERROCARRILES NACIONALES DE COLOMBIA' },
    { value: 'cajacopi_atlantico', label: 'CAJACOPI ATLANTICO' },
    { value: 'capresoca', label: 'CAPRESOCA' },
    { value: 'comfachoco', label: 'COMFACHOCO' },
    { value: 'comfaoriente', label: 'COMFAORIENTE' },
    { value: 'eps_familiar', label: 'EPS FAMILIAR DE COLOMBIA' },
    { value: 'asmet_salud', label: 'ASMET SALUD' },
    { value: 'emssanar', label: 'EMSSANAR E.S.S.' },
    { value: 'capital_salud', label: 'CAPITAL SALUD EPS-S' },
    { value: 'savia_salud', label: 'SAVIA SALUD EPS' },
    { value: 'dusakawi_epsi', label: 'DUSAKAWI EPSI' },
    { value: 'asociacion_indigena_cauca', label: 'ASOCIACION INDIGENA DEL CAUCA EPSI' },
    { value: 'anas_wayuu_epsi', label: 'ANAS WAYUU EPSI' },
    { value: 'mallamas_epsi', label: 'MALLAMAS EPSI' },
    { value: 'pijaos_salud_epsi', label: 'PIJAOS SALUD EPSI' },
    { value: 'salud_bolivar_eps', label: 'SALUD BOLIVAR EPS SAS' },
];

const soatOptions = [
    { value: 'aseguradora_solidaria', label: 'Aseguradora Solidaria de Colombia Ltda. Entidad Cooperativa' },
    { value: 'axa_colpatria', label: 'Axa Colpatria Seguros S.A.' },
    { value: 'hdi_seguros', label: 'HDI Seguros Colombia S.A.' },
    { value: 'seguros_mundial', label: 'Seguros Mundial' },
    { value: 'la_previsora', label: 'La Previsora S.A. Compañía de Seguros' },
    { value: 'seguros_bolivar_soat', label: 'Seguros Bolívar S.A.' },
    { value: 'seguros_estado', label: 'Seguros del Estado S.A.' },
    { value: 'seguros_suramericana', label: 'Seguros Generales Suramericana S.A.' },
];

const departamentos = [
    { value: 'amazonas', label: 'Amazonas' },
    { value: 'antioquia', label: 'Antioquia' },
    { value: 'arauca', label: 'Arauca' },
    { value: 'atlantico', label: 'Atlántico' },
    { value: 'bolivar', label: 'Bolívar' },
    { value: 'boyaca', label: 'Boyacá' },
    { value: 'caldas', label: 'Caldas' },
    { value: 'caqueta', label: 'Caquetá' },
    { value: 'casanare', label: 'Casanare' },
    { value: 'cauca', label: 'Cauca' },
    { value: 'cesar', label: 'Cesar' },
    { value: 'choco', label: 'Chocó' },
    { value: 'cordoba', label: 'Córdoba' },
    { value: 'cundinamarca', label: 'Cundinamarca' },
    { value: 'guainia', label: 'Guainía' },
    { value: 'guaviare', label: 'Guaviare' },
    { value: 'huila', label: 'Huila' },
    { value: 'la_guajira', label: 'La Guajira' },
    { value: 'magdalena', label: 'Magdalena' },
    { value: 'meta', label: 'Meta' },
    { value: 'narino', label: 'Nariño' },
    { value: 'norte_santander', label: 'Norte de Santander' },
    { value: 'putumayo', label: 'Putumayo' },
    { value: 'quindio', label: 'Quindío' },
    { value: 'risaralda', label: 'Risaralda' },
    { value: 'san_andres', label: 'San Andrés y Providencia' },
    { value: 'santander', label: 'Santander' },
    { value: 'sucre', label: 'Sucre' },
    { value: 'tolima', label: 'Tolima' },
    { value: 'valle_del_cauca', label: 'Valle del Cauca' },
    { value: 'vaupes', label: 'Vaupés' },
    { value: 'vichada', label: 'Vichada' },
];

const ciudadesPorDepartamento: Record<string, Array<{value: string, label: string}>> = {
    amazonas: [
        { value: 'leticia', label: 'Leticia' },
        { value: 'el_encanto', label: 'El Encanto' },
        { value: 'la_chorrera', label: 'La Chorrera' },
        { value: 'la_pedrera', label: 'La Pedrera' },
        { value: 'la_victoria', label: 'La Victoria' },
        { value: 'miriti_parana', label: 'Miriti - Parana' },
        { value: 'puerto_alegria', label: 'Puerto Alegria' },
        { value: 'puerto_arica', label: 'Puerto Arica' },
        { value: 'puerto_narino', label: 'Puerto Nariño' },
        { value: 'puerto_santander', label: 'Puerto Santander' },
        { value: 'tarapaca', label: 'Tarapaca' },
    ],
    arauca: [
        { value: 'arauca', label: 'Arauca' },
        { value: 'arauquita', label: 'Arauquita' },
        { value: 'cravo_norte', label: 'Cravo Norte' },
        { value: 'fortul', label: 'Fortul' },
        { value: 'puerto_rondon', label: 'Puerto Rondon' },
        { value: 'saravena', label: 'Saravena' },
        { value: 'tame', label: 'Tame' },
    ],
    atlantico: [
        { value: 'barranquilla', label: 'Barranquilla' },
        { value: 'baranoa', label: 'Baranoa' },
        { value: 'campo_de_la_cruz', label: 'Campo de la Cruz' },
        { value: 'candelaria', label: 'Candelaria' },
        { value: 'galapa', label: 'Galapa' },
        { value: 'juan_de_acosta', label: 'Juan de Acosta' },
        { value: 'luruaco', label: 'Luruaco' },
        { value: 'malambo', label: 'Malambo' },
        { value: 'manati', label: 'Manati' },
        { value: 'palmar_de_varela', label: 'Palmar de Varela' },
        { value: 'piojo', label: 'Piojo' },
        { value: 'polonuevo', label: 'Polonuevo' },
        { value: 'ponedera', label: 'Ponedera' },
        { value: 'puerto_colombia', label: 'Puerto Colombia' },
        { value: 'repelon', label: 'Repelon' },
        { value: 'sabanagrande', label: 'Sabanagrande' },
        { value: 'sabanalarga', label: 'Sabanalarga' },
        { value: 'santa_lucia', label: 'Santa Lucia' },
        { value: 'santo_tomas', label: 'Santo Tomas' },
        { value: 'soledad', label: 'Soledad' },
        { value: 'suan', label: 'Suan' },
        { value: 'tubara', label: 'Tubara' },
        { value: 'usiacuri', label: 'Usiacuri' },
    ],
    antioquia: [
        { value: 'medellin', label: 'Medellín' },
        { value: 'abejorral', label: 'Abejorral' },
        { value: 'abriaqui', label: 'Abriaqui' },
        { value: 'alejandria', label: 'Alejandria' },
        { value: 'amaga', label: 'Amaga' },
        { value: 'amalfi', label: 'Amalfi' },
        { value: 'andes', label: 'Andes' },
        { value: 'angelopolis', label: 'Angelopolis' },
        { value: 'angostura', label: 'Angostura' },
        { value: 'anori', label: 'Anori' },
        { value: 'santafe_de_antioquia', label: 'Santafe de Antioquia' },
        { value: 'anza', label: 'Anza' },
        { value: 'apartado', label: 'Apartado' },
        { value: 'arboletes', label: 'Arboletes' },
        { value: 'argelia', label: 'Argelia' },
        { value: 'armenia', label: 'Armenia' },
        { value: 'barbosa', label: 'Barbosa' },
        { value: 'belmira', label: 'Belmira' },
        { value: 'bello', label: 'Bello' },
        { value: 'betania', label: 'Betania' },
        { value: 'betulia', label: 'Betulia' },
        { value: 'ciudad_bolivar', label: 'Ciudad Bolivar' },
        { value: 'briceno', label: 'Briceño' },
        { value: 'buritica', label: 'Buritica' },
        { value: 'caceres', label: 'Caceres' },
        { value: 'caicedo', label: 'Caicedo' },
        { value: 'caldas', label: 'Caldas' },
        { value: 'campamento', label: 'Campamento' },
        { value: 'canasgordas', label: 'Cañasgordas' },
        { value: 'caracoli', label: 'Caracoli' },
        { value: 'caramanta', label: 'Caramanta' },
        { value: 'carepa', label: 'Carepa' },
        { value: 'carmen_de_viboral', label: 'Carmen de Viboral' },
        { value: 'carolina', label: 'Carolina' },
        { value: 'caucasia', label: 'Caucasia' },
        { value: 'chigorodo', label: 'Chigorodo' },
        { value: 'cisneros', label: 'Cisneros' },
        { value: 'cocorna', label: 'Cocorna' },
        { value: 'concepcion', label: 'Concepcion' },
        { value: 'concordia', label: 'Concordia' },
        { value: 'copacabana', label: 'Copacabana' },
        { value: 'dabeiba', label: 'Dabeiba' },
        { value: 'don_matias', label: 'Don Matias' },
        { value: 'ebejico', label: 'Ebejico' },
        { value: 'el_bagre', label: 'El Bagre' },
        { value: 'entrerrios', label: 'Entrerrios' },
        { value: 'envigado', label: 'Envigado' },
        { value: 'fredonia', label: 'Fredonia' },
        { value: 'frontino', label: 'Frontino' },
        { value: 'giraldo', label: 'Giraldo' },
        { value: 'girardota', label: 'Girardota' },
        { value: 'gomez_plata', label: 'Gomez Plata' },
        { value: 'granada', label: 'Granada' },
        { value: 'guadalupe', label: 'Guadalupe' },
        { value: 'guarne', label: 'Guarne' },
        { value: 'guatape', label: 'Guatape' },
        { value: 'heliconia', label: 'Heliconia' },
        { value: 'hispania', label: 'Hispania' },
        { value: 'itagui', label: 'Itagui' },
        { value: 'ituango', label: 'Ituango' },
        { value: 'jardin', label: 'Jardin' },
        { value: 'jerico', label: 'Jerico' },
        { value: 'la_ceja', label: 'La Ceja' },
        { value: 'la_estrella', label: 'La Estrella' },
        { value: 'la_pintada', label: 'La Pintada' },
        { value: 'la_union', label: 'La Union' },
        { value: 'liborina', label: 'Liborina' },
        { value: 'maceo', label: 'Maceo' },
        { value: 'marinilla', label: 'Marinilla' },
        { value: 'montebello', label: 'Montebello' },
        { value: 'murindo', label: 'Murindo' },
        { value: 'mutata', label: 'Mutata' },
        { value: 'narino', label: 'Nariño' },
        { value: 'necocli', label: 'Necocli' },
        { value: 'nechi', label: 'Nechi' },
        { value: 'olaya', label: 'Olaya' },
        { value: 'penol', label: 'Peñol' },
        { value: 'peque', label: 'Peque' },
        { value: 'pueblorrico', label: 'Pueblorrico' },
        { value: 'puerto_berrio', label: 'Puerto Berrio' },
        { value: 'puerto_nare', label: 'Puerto Nare' },
        { value: 'puerto_triunfo', label: 'Puerto Triunfo' },
        { value: 'remedios', label: 'Remedios' },
        { value: 'retiro', label: 'Retiro' },
        { value: 'rionegro', label: 'Rionegro' },
        { value: 'sabanalarga', label: 'Sabanalarga' },
        { value: 'sabaneta', label: 'Sabaneta' },
        { value: 'salgar', label: 'Salgar' },
        { value: 'san_andres', label: 'San Andres' },
        { value: 'san_carlos', label: 'San Carlos' },
        { value: 'san_francisco', label: 'San Francisco' },
        { value: 'san_jeronimo', label: 'San Jeronimo' },
        { value: 'san_jose_de_la_montana', label: 'San Jose de la Montaña' },
        { value: 'san_juan_de_uraba', label: 'San Juan de Uraba' },
        { value: 'san_luis', label: 'San Luis' },
        { value: 'san_pedro', label: 'San Pedro' },
        { value: 'san_pedro_de_uraba', label: 'San Pedro de Uraba' },
        { value: 'san_rafael', label: 'San Rafael' },
        { value: 'san_roque', label: 'San Roque' },
        { value: 'san_vicente', label: 'San Vicente' },
        { value: 'santa_barbara', label: 'Santa Barbara' },
        { value: 'santa_rosa_de_osos', label: 'Santa Rosa de Osos' },
        { value: 'santo_domingo', label: 'Santo Domingo' },
        { value: 'santuario', label: 'Santuario' },
        { value: 'segovia', label: 'Segovia' },
        { value: 'sonson', label: 'Sonson' },
        { value: 'sopetran', label: 'Sopetran' },
        { value: 'tamesis', label: 'Tamesis' },
        { value: 'taraza', label: 'Taraza' },
        { value: 'tarso', label: 'Tarso' },
        { value: 'titiribi', label: 'Titiribi' },
        { value: 'toledo', label: 'Toledo' },
        { value: 'turbo', label: 'Turbo' },
        { value: 'uramita', label: 'Uramita' },
        { value: 'urrao', label: 'Urrao' },
        { value: 'valdivia', label: 'Valdivia' },
        { value: 'valparaiso', label: 'Valparaiso' },
        { value: 'vegachi', label: 'Vegachi' },
        { value: 'venecia', label: 'Venecia' },
        { value: 'vigia_del_fuerte', label: 'Vigia del Fuerte' },
        { value: 'yali', label: 'Yali' },
        { value: 'yarumal', label: 'Yarumal' },
        { value: 'yolombo', label: 'Yolombo' },
        { value: 'yondo', label: 'Yondo' },
        { value: 'zaragoza', label: 'Zaragoza' },
    ],
    bolivar: [
        { value: 'cartagena', label: 'Cartagena' },
        { value: 'achi', label: 'Achi' },
        { value: 'altos_del_rosario', label: 'Altos del Rosario' },
        { value: 'arenal', label: 'Arenal' },
        { value: 'arjona', label: 'Arjona' },
        { value: 'arroyohondo', label: 'Arroyohondo' },
        { value: 'barranco_de_loba', label: 'Barranco de Loba' },
        { value: 'calamar', label: 'Calamar' },
        { value: 'cantagallo', label: 'Cantagallo' },
        { value: 'cicuco', label: 'Cicuco' },
        { value: 'cordoba', label: 'Cordoba' },
        { value: 'clemencia', label: 'Clemencia' },
        { value: 'el_carmen_de_bolivar', label: 'El Carmen de Bolivar' },
        { value: 'el_guamo', label: 'El Guamo' },
        { value: 'el_penon', label: 'El Peñon' },
        { value: 'hatillo_de_loba', label: 'Hatillo de Loba' },
        { value: 'magangue', label: 'Magangue' },
        { value: 'mahates', label: 'Mahates' },
        { value: 'margarita', label: 'Margarita' },
        { value: 'maria_la_baja', label: 'Maria la Baja' },
        { value: 'montecristo', label: 'Montecristo' },
        { value: 'mompos', label: 'Mompos' },
        { value: 'morales', label: 'Morales' },
        { value: 'norosi', label: 'Norosi' },
        { value: 'pinillos', label: 'Pinillos' },
        { value: 'regidor', label: 'Regidor' },
        { value: 'rio_viejo', label: 'Rio Viejo' },
        { value: 'san_cristobal', label: 'San Cristobal' },
        { value: 'san_estanislao', label: 'San Estanislao' },
        { value: 'san_fernando', label: 'San Fernando' },
        { value: 'san_jacinto', label: 'San Jacinto' },
        { value: 'san_jacinto_del_cauca', label: 'San Jacinto del Cauca' },
        { value: 'san_juan_nepomuceno', label: 'San Juan Nepomuceno' },
        { value: 'san_martin_de_loba', label: 'San Martin de Loba' },
        { value: 'san_pablo', label: 'San Pablo' },
        { value: 'santa_catalina', label: 'Santa Catalina' },
        { value: 'santa_rosa', label: 'Santa Rosa' },
        { value: 'santa_rosa_del_sur', label: 'Santa Rosa del Sur' },
        { value: 'simiti', label: 'Simiti' },
        { value: 'soplaviento', label: 'Soplaviento' },
        { value: 'talaigua_nuevo', label: 'Talaigua Nuevo' },
        { value: 'tiquisio', label: 'Tiquisio' },
        { value: 'turbaco', label: 'Turbaco' },
        { value: 'turbana', label: 'Turbana' },
        { value: 'villanueva', label: 'Villanueva' },
        { value: 'zambrano', label: 'Zambrano' },
    ],
    boyaca: [
        { value: 'tunja', label: 'Tunja' },
        { value: 'almeida', label: 'Almeida' },
        { value: 'aquitania', label: 'Aquitania' },
        { value: 'arcabuco', label: 'Arcabuco' },
        { value: 'belen', label: 'Belen' },
        { value: 'berbeo', label: 'Berbeo' },
        { value: 'beteitiva', label: 'Beteitiva' },
        { value: 'boavita', label: 'Boavita' },
        { value: 'boyaca', label: 'Boyaca' },
        { value: 'briceno', label: 'Briceño' },
        { value: 'buenavista', label: 'Buenavista' },
        { value: 'busbanza', label: 'Busbanza' },
        { value: 'caldas', label: 'Caldas' },
        { value: 'campohermoso', label: 'Campohermoso' },
        { value: 'cerinza', label: 'Cerinza' },
        { value: 'chinavita', label: 'Chinavita' },
        { value: 'chiquinquira', label: 'Chiquinquira' },
        { value: 'chiscas', label: 'Chiscas' },
        { value: 'chita', label: 'Chita' },
        { value: 'chitaraque', label: 'Chitaraque' },
        { value: 'chivata', label: 'Chivata' },
        { value: 'cienega', label: 'Cienega' },
        { value: 'combita', label: 'Combita' },
        { value: 'coper', label: 'Coper' },
        { value: 'corrales', label: 'Corrales' },
        { value: 'covarachia', label: 'Covarachia' },
        { value: 'cubara', label: 'Cubara' },
        { value: 'cucaita', label: 'Cucaita' },
        { value: 'cuitiva', label: 'Cuitiva' },
        { value: 'chiquiza', label: 'Chiquiza' },
        { value: 'chivor', label: 'Chivor' },
        { value: 'duitama', label: 'Duitama' },
        { value: 'el_cocuy', label: 'El Cocuy' },
        { value: 'el_espino', label: 'El Espino' },
        { value: 'firavitoba', label: 'Firavitoba' },
        { value: 'floresta', label: 'Floresta' },
        { value: 'gachantiva', label: 'Gachantiva' },
        { value: 'gameza', label: 'Gameza' },
        { value: 'garagoa', label: 'Garagoa' },
        { value: 'guacamayas', label: 'Guacamayas' },
        { value: 'guateque', label: 'Guateque' },
        { value: 'guayata', label: 'Guayata' },
        { value: 'guican', label: 'Guican' },
        { value: 'iza', label: 'Iza' },
        { value: 'jenesano', label: 'Jenesano' },
        { value: 'jerico', label: 'Jerico' },
        { value: 'labranzagrande', label: 'Labranzagrande' },
        { value: 'la_capilla', label: 'La Capilla' },
        { value: 'la_victoria', label: 'La Victoria' },
        { value: 'la_uvita', label: 'La Uvita' },
        { value: 'villa_de_leyva', label: 'Villa de Leyva' },
        { value: 'macanal', label: 'Macanal' },
        { value: 'maripi', label: 'Maripi' },
        { value: 'miraflores', label: 'Miraflores' },
        { value: 'mongua', label: 'Mongua' },
        { value: 'mongui', label: 'Mongui' },
        { value: 'moniquira', label: 'Moniquira' },
        { value: 'motavita', label: 'Motavita' },
        { value: 'muzo', label: 'Muzo' },
        { value: 'nobsa', label: 'Nobsa' },
        { value: 'nuevo_colon', label: 'Nuevo Colon' },
        { value: 'oicata', label: 'Oicata' },
        { value: 'otanche', label: 'Otanche' },
        { value: 'pachavita', label: 'Pachavita' },
        { value: 'paez', label: 'Paez' },
        { value: 'paipa', label: 'Paipa' },
        { value: 'pajarito', label: 'Pajarito' },
        { value: 'panqueba', label: 'Panqueba' },
        { value: 'pauna', label: 'Pauna' },
        { value: 'paya', label: 'Paya' },
        { value: 'paz_de_rio', label: 'Paz de Rio' },
        { value: 'pesca', label: 'Pesca' },
        { value: 'pisba', label: 'Pisba' },
        { value: 'puerto_boyaca', label: 'Puerto Boyaca' },
        { value: 'quipama', label: 'Quipama' },
        { value: 'ramiriqui', label: 'Ramiriqui' },
        { value: 'raquira', label: 'Raquira' },
        { value: 'rondon', label: 'Rondon' },
        { value: 'saboya', label: 'Saboya' },
        { value: 'sachica', label: 'Sachica' },
        { value: 'samaca', label: 'Samaca' },
        { value: 'san_eduardo', label: 'San Eduardo' },
        { value: 'san_jose_de_pare', label: 'San Jose de Pare' },
        { value: 'san_luis_de_gaceno', label: 'San Luis de Gaceno' },
        { value: 'san_mateo', label: 'San Mateo' },
        { value: 'san_miguel_de_sema', label: 'San Miguel de Sema' },
        { value: 'san_pablo_borbur', label: 'San Pablo Borbur' },
        { value: 'santana', label: 'Santana' },
        { value: 'santa_maria', label: 'Santa Maria' },
        { value: 'san_rosa_viterbo', label: 'San Rosa Viterbo' },
        { value: 'santa_sofia', label: 'Santa Sofia' },
        { value: 'sativanorte', label: 'Sativanorte' },
        { value: 'sativasur', label: 'Sativasur' },
        { value: 'siachoque', label: 'Siachoque' },
        { value: 'soata', label: 'Soata' },
        { value: 'socota', label: 'Socota' },
        { value: 'socha', label: 'Socha' },
        { value: 'sogamoso', label: 'Sogamoso' },
        { value: 'somondoco', label: 'Somondoco' },
        { value: 'sora', label: 'Sora' },
        { value: 'sotaquira', label: 'Sotaquira' },
        { value: 'soraca', label: 'Soraca' },
        { value: 'susacon', label: 'Susacon' },
        { value: 'sutamarchan', label: 'Sutamarchan' },
        { value: 'sutatenza', label: 'Sutatenza' },
        { value: 'tasco', label: 'Tasco' },
        { value: 'tenza', label: 'Tenza' },
        { value: 'tibana', label: 'Tibana' },
        { value: 'tibasosa', label: 'Tibasosa' },
        { value: 'tinjaca', label: 'Tinjaca' },
        { value: 'tipacoque', label: 'Tipacoque' },
        { value: 'toca', label: 'Toca' },
        { value: 'togui', label: 'Togui' },
        { value: 'topaga', label: 'Topaga' },
        { value: 'tota', label: 'Tota' },
        { value: 'tunungua', label: 'Tunungua' },
        { value: 'turmeque', label: 'Turmeque' },
        { value: 'tuta', label: 'Tuta' },
        { value: 'tutaza', label: 'Tutaza' },
        { value: 'umbita', label: 'Umbita' },
        { value: 'ventaquemada', label: 'Ventaquemada' },
        { value: 'viracacha', label: 'Viracacha' },
        { value: 'zetaquira', label: 'Zetaquira' },
    ],
    caldas: [
        { value: 'manizales', label: 'Manizales' },
        { value: 'aguadas', label: 'Aguadas' },
        { value: 'anserma', label: 'Anserma' },
        { value: 'aranzazu', label: 'Aranzazu' },
        { value: 'belalcazar', label: 'Belalcazar' },
        { value: 'chinchina', label: 'Chinchina' },
        { value: 'filadelfia', label: 'Filadelfia' },
        { value: 'la_dorada', label: 'La Dorada' },
        { value: 'la_merced', label: 'La Merced' },
        { value: 'manzanares', label: 'Manzanares' },
        { value: 'marmato', label: 'Marmato' },
        { value: 'marquetalia', label: 'Marquetalia' },
        { value: 'marulanda', label: 'Marulanda' },
        { value: 'neira', label: 'Neira' },
        { value: 'norcasia', label: 'Norcasia' },
        { value: 'pacora', label: 'Pacora' },
        { value: 'palestina', label: 'Palestina' },
        { value: 'pensilvania', label: 'Pensilvania' },
        { value: 'riosucio', label: 'Riosucio' },
        { value: 'risaralda', label: 'Risaralda' },
        { value: 'salamina', label: 'Salamina' },
        { value: 'samana', label: 'Samana' },
        { value: 'san_jose', label: 'San Jose' },
        { value: 'supia', label: 'Supia' },
        { value: 'victoria', label: 'Victoria' },
        { value: 'villamaria', label: 'Villamaria' },
        { value: 'viterbo', label: 'Viterbo' },
    ],
    caqueta: [
        { value: 'florencia', label: 'Florencia' },
        { value: 'albania', label: 'Albania' },
        { value: 'belen_de_los_andaquies', label: 'Belen de los Andaquies' },
        { value: 'cartagena_del_chaira', label: 'Cartagena del Chaira' },
        { value: 'currillo', label: 'Currillo' },
        { value: 'el_doncello', label: 'El Doncello' },
        { value: 'el_paujil', label: 'El Paujil' },
        { value: 'la_montanita', label: 'La Montañita' },
        { value: 'milan', label: 'Milan' },
        { value: 'morelia', label: 'Morelia' },
        { value: 'puerto_rico', label: 'Puerto Rico' },
        { value: 'san_jose_del_fragua', label: 'San Jose del Fragua' },
        { value: 'san_vicente_del_caguan', label: 'San Vicente del Caguan' },
        { value: 'solano', label: 'Solano' },
        { value: 'solita', label: 'Solita' },
        { value: 'valparaiso', label: 'Valparaiso' },
    ],
    casanare: [
        { value: 'yopal', label: 'Yopal' },
        { value: 'aguazul', label: 'Aguazul' },
        { value: 'chameza', label: 'Chameza' },
        { value: 'hato_corozal', label: 'Hato Corozal' },
        { value: 'la_salina', label: 'La Salina' },
        { value: 'mani', label: 'Mani' },
        { value: 'monterrey', label: 'Monterrey' },
        { value: 'nunchia', label: 'Nunchia' },
        { value: 'orocue', label: 'Orocue' },
        { value: 'paz_de_ariporo', label: 'Paz de Ariporo' },
        { value: 'pore', label: 'Pore' },
        { value: 'recetor', label: 'Recetor' },
        { value: 'sabanalarga', label: 'Sabanalarga' },
        { value: 'sacama', label: 'Sacama' },
        { value: 'san_luis_de_palenque', label: 'San Luis de Palenque' },
        { value: 'tamara', label: 'Tamara' },
        { value: 'tauramena', label: 'Tauramena' },
        { value: 'trinidad', label: 'Trinidad' },
        { value: 'villanueva', label: 'Villanueva' },
    ],
    cauca: [
        { value: 'popayan', label: 'Popayan' },
        { value: 'almaguer', label: 'Almaguer' },
        { value: 'argelia', label: 'Argelia' },
        { value: 'balboa', label: 'Balboa' },
        { value: 'bolivar', label: 'Bolivar' },
        { value: 'buenos_aires', label: 'Buenos Aires' },
        { value: 'cajibio', label: 'Cajibio' },
        { value: 'caldono', label: 'Caldono' },
        { value: 'caloto', label: 'Caloto' },
        { value: 'corinto', label: 'Corinto' },
        { value: 'el_tambo', label: 'El Tambo' },
        { value: 'florencia', label: 'Florencia' },
        { value: 'guachene', label: 'Guachene' },
        { value: 'guapi', label: 'Guapi' },
        { value: 'inza', label: 'Inza' },
        { value: 'jambalo', label: 'Jambalo' },
        { value: 'la_sierra', label: 'La Sierra' },
        { value: 'la_vega', label: 'La Vega' },
        { value: 'lopez', label: 'Lopez' },
        { value: 'mercaderes', label: 'Mercaderes' },
        { value: 'miranda', label: 'Miranda' },
        { value: 'morales', label: 'Morales' },
        { value: 'padilla', label: 'Padilla' },
        { value: 'paez', label: 'Paez' },
        { value: 'patia', label: 'Patia' },
        { value: 'piamonte', label: 'Piamonte' },
        { value: 'piendamo', label: 'Piendamo' },
        { value: 'puerto_tejada', label: 'Puerto Tejada' },
        { value: 'purace', label: 'Purace' },
        { value: 'rosas', label: 'Rosas' },
        { value: 'san_sebastian', label: 'San Sebastian' },
        { value: 'santander_de_quilichao', label: 'Santander de Quilichao' },
        { value: 'santa_rosa', label: 'Santa Rosa' },
        { value: 'silvia', label: 'Silvia' },
        { value: 'sotara', label: 'Sotara' },
        { value: 'suarez', label: 'Suarez' },
        { value: 'sucre', label: 'Sucre' },
        { value: 'timbio', label: 'Timbio' },
        { value: 'timbiqui', label: 'Timbiqui' },
        { value: 'toribio', label: 'Toribio' },
        { value: 'totoro', label: 'Totoro' },
        { value: 'villa_rica', label: 'Villa Rica' },
    ],
    cesar: [
        { value: 'valledupar', label: 'Valledupar' },
        { value: 'aguachica', label: 'Aguachica' },
        { value: 'agustin_codazzi', label: 'Agustin Codazzi' },
        { value: 'astrea', label: 'Astrea' },
        { value: 'becerril', label: 'Becerril' },
        { value: 'bosconia', label: 'Bosconia' },
        { value: 'chimichagua', label: 'Chimichagua' },
        { value: 'chiriguana', label: 'Chiriguana' },
        { value: 'curumani', label: 'Curumani' },
        { value: 'el_copey', label: 'El Copey' },
        { value: 'el_paso', label: 'El Paso' },
        { value: 'gamarra', label: 'Gamarra' },
        { value: 'gonzalez', label: 'Gonzalez' },
        { value: 'la_gloria', label: 'La Gloria' },
        { value: 'la_jagua_de_ibirico', label: 'La Jagua de Ibirico' },
        { value: 'manaure', label: 'Manaure' },
        { value: 'pailitas', label: 'Pailitas' },
        { value: 'pelaya', label: 'Pelaya' },
        { value: 'pueblo_bello', label: 'Pueblo Bello' },
        { value: 'rio_de_oro', label: 'Rio de Oro' },
        { value: 'la_paz', label: 'La Paz' },
        { value: 'san_alberto', label: 'San Alberto' },
        { value: 'san_diego', label: 'San Diego' },
        { value: 'san_martin', label: 'San Martin' },
        { value: 'tamalameque', label: 'Tamalameque' },
    ],
    choco: [
        { value: 'quibdo', label: 'Quibdo' },
        { value: 'acandi', label: 'Acandi' },
        { value: 'alto_baudo', label: 'Alto Baudo' },
        { value: 'atrato', label: 'Atrato' },
        { value: 'bagado', label: 'Bagado' },
        { value: 'bahia_solano', label: 'Bahia Solano' },
        { value: 'bajo_baudo', label: 'Bajo Baudo' },
        { value: 'bojaya', label: 'Bojaya' },
        { value: 'canton_de_san_pablo', label: 'Canton de San Pablo' },
        { value: 'carmen_del_darien', label: 'Carmen del Darien' },
        { value: 'certegui', label: 'Certegui' },
        { value: 'condoto', label: 'Condoto' },
        { value: 'el_carmen_de_atrato', label: 'El Carmen de Atrato' },
        { value: 'el_litoral_del_san_juan', label: 'El Litoral del San Juan' },
        { value: 'itsmina', label: 'Itsmina' },
        { value: 'jurado', label: 'Jurado' },
        { value: 'lloro', label: 'Lloro' },
        { value: 'medio_atrato', label: 'Medio Atrato' },
        { value: 'medio_baudo', label: 'Medio Baudo' },
        { value: 'medio_san_juan', label: 'Medio San Juan' },
        { value: 'novita', label: 'Novita' },
        { value: 'nuqui', label: 'Nuqui' },
        { value: 'rio_iro', label: 'Rio Iro' },
        { value: 'rio_quito', label: 'Rio Quito' },
        { value: 'riosucio', label: 'Riosucio' },
        { value: 'san_jose_del_palmar', label: 'San Jose del Palmar' },
        { value: 'sipi', label: 'Sipi' },
        { value: 'tado', label: 'Tado' },
        { value: 'unguia', label: 'Unguia' },
        { value: 'union_panamericana', label: 'Union Panamericana' },
    ],
    cordoba: [
        { value: 'monteria', label: 'Monteria' },
        { value: 'ayapel', label: 'Ayapel' },
        { value: 'buenavista', label: 'Buenavista' },
        { value: 'canalete', label: 'Canalete' },
        { value: 'cerete', label: 'Cerete' },
        { value: 'chima', label: 'Chima' },
        { value: 'chinu', label: 'Chinu' },
        { value: 'cienaga_de_oro', label: 'Cienaga de Oro' },
        { value: 'cotorra', label: 'Cotorra' },
        { value: 'la_apartada', label: 'La Apartada' },
        { value: 'lorica', label: 'Lorica' },
        { value: 'los_cordobas', label: 'Los Cordobas' },
        { value: 'momil', label: 'Momil' },
        { value: 'montelibano', label: 'Montelibano' },
        { value: 'monitos', label: 'Moñitos' },
        { value: 'planeta_rica', label: 'Planeta Rica' },
        { value: 'pueblo_nuevo', label: 'Pueblo Nuevo' },
        { value: 'puerto_escondido', label: 'Puerto Escondido' },
        { value: 'puerto_libertador', label: 'Puerto Libertador' },
        { value: 'purisima', label: 'Purisima' },
        { value: 'sahagun', label: 'Sahagun' },
        { value: 'san_andres_sotavento', label: 'San Andres Sotavento' },
        { value: 'san_antero', label: 'San Antero' },
        { value: 'san_bernardo_del_viento', label: 'San Bernardo del Viento' },
        { value: 'san_carlos', label: 'San Carlos' },
        { value: 'san_jose_de_ure', label: 'San Jose de Ure' },
        { value: 'san_pelayo', label: 'San Pelayo' },
        { value: 'tierralta', label: 'Tierralta' },
        { value: 'tuchin', label: 'Tuchin' },
        { value: 'valencia', label: 'Valencia' },
    ],
    cundinamarca: [
        { value: 'bogota', label: 'Bogota D.C' },
        { value: 'agua_de_dios', label: 'Agua de Dios' },
        { value: 'alban', label: 'Alban' },
        { value: 'anapoima', label: 'Anapoima' },
        { value: 'anolaima', label: 'Anolaima' },
        { value: 'arbelaez', label: 'Arbelaez' },
        { value: 'beltran', label: 'Beltran' },
        { value: 'bituima', label: 'Bituima' },
        { value: 'bojaca', label: 'Bojaca' },
        { value: 'cabrera', label: 'Cabrera' },
        { value: 'cachipay', label: 'Cachipay' },
        { value: 'cajica', label: 'Cajica' },
        { value: 'caparrapi', label: 'Caparrapi' },
        { value: 'caqueza', label: 'Caqueza' },
        { value: 'carmen_de_carupa', label: 'Carmen de Carupa' },
        { value: 'chaguani', label: 'Chaguani' },
        { value: 'chia', label: 'Chia' },
        { value: 'chipaque', label: 'Chipaque' },
        { value: 'choachi', label: 'Choachi' },
        { value: 'choconta', label: 'Choconta' },
        { value: 'cogua', label: 'Cogua' },
        { value: 'cota', label: 'Cota' },
        { value: 'cucunuba', label: 'Cucunuba' },
        { value: 'el_colegio', label: 'El Colegio' },
        { value: 'el_penon', label: 'El Peñon' },
        { value: 'el_rosal', label: 'El Rosal' },
        { value: 'facatativa', label: 'Facatativa' },
        { value: 'fomeque', label: 'Fomeque' },
        { value: 'fosca', label: 'Fosca' },
        { value: 'funza', label: 'Funza' },
        { value: 'fuquene', label: 'Fuquene' },
        { value: 'fusagasuga', label: 'Fusagasuga' },
        { value: 'gachala', label: 'Gachala' },
        { value: 'gachancipa', label: 'Gachancipa' },
        { value: 'gacheta', label: 'Gacheta' },
        { value: 'gama', label: 'Gama' },
        { value: 'girardot', label: 'Girardot' },
        { value: 'granada', label: 'Granada' },
        { value: 'guacheta', label: 'Guacheta' },
        { value: 'guaduas', label: 'Guaduas' },
        { value: 'guasca', label: 'Guasca' },
        { value: 'guataqui', label: 'Guataqui' },
        { value: 'guatavita', label: 'Guatavita' },
        { value: 'guayabal_de_siquima', label: 'Guayabal de Siquima' },
        { value: 'guayabetal', label: 'Guayabetal' },
        { value: 'gutierrez', label: 'Gutierrez' },
        { value: 'jerusalen', label: 'Jerusalen' },
        { value: 'junin', label: 'Junin' },
        { value: 'la_calera', label: 'La Calera' },
        { value: 'la_mesa', label: 'La Mesa' },
        { value: 'la_palma', label: 'La Palma' },
        { value: 'la_pena', label: 'La Peña' },
        { value: 'la_vega', label: 'La Vega' },
        { value: 'lenguazaque', label: 'Lenguazaque' },
        { value: 'macheta', label: 'Macheta' },
        { value: 'madrid', label: 'Madrid' },
        { value: 'manta', label: 'Manta' },
        { value: 'medina', label: 'Medina' },
        { value: 'mosquera', label: 'Mosquera' },
        { value: 'narino', label: 'Nariño' },
        { value: 'nemocon', label: 'Nemocon' },
        { value: 'nilo', label: 'Nilo' },
        { value: 'nimaima', label: 'Nimaima' },
        { value: 'nocaima', label: 'Nocaima' },
        { value: 'venecia', label: 'Venecia' },
        { value: 'pacho', label: 'Pacho' },
        { value: 'paime', label: 'Paime' },
        { value: 'pandi', label: 'Pandi' },
        { value: 'paratebueno', label: 'Paratebueno' },
        { value: 'pasca', label: 'Pasca' },
        { value: 'puerto_salgar', label: 'Puerto Salgar' },
        { value: 'puli', label: 'Puli' },
        { value: 'quebradanegra', label: 'Quebradanegra' },
        { value: 'quetame', label: 'Quetame' },
        { value: 'quipile', label: 'Quipile' },
        { value: 'apulo', label: 'Apulo' },
        { value: 'ricaurte', label: 'Ricaurte' },
        { value: 'san_antonio_de_tequendama', label: 'San Antonio de Tequendama' },
        { value: 'san_bernardo', label: 'San Bernardo' },
        { value: 'san_cayetano', label: 'San Cayetano' },
        { value: 'san_francisco', label: 'San Francisco' },
        { value: 'san_juan_de_rio_seco', label: 'San Juan de Rio Seco' },
        { value: 'sasaima', label: 'Sasaima' },
        { value: 'sesquile', label: 'Sesquile' },
        { value: 'sibate', label: 'Sibate' },
        { value: 'silvania', label: 'Silvania' },
        { value: 'simijaca', label: 'Simijaca' },
        { value: 'soacha', label: 'Soacha' },
        { value: 'sopo', label: 'Sopo' },
        { value: 'subachoque', label: 'Subachoque' },
        { value: 'suesca', label: 'Suesca' },
        { value: 'supata', label: 'Supata' },
        { value: 'susa', label: 'Susa' },
        { value: 'sutatausa', label: 'Sutatausa' },
        { value: 'tabio', label: 'Tabio' },
        { value: 'tausa', label: 'Tausa' },
        { value: 'tena', label: 'Tena' },
        { value: 'tenjo', label: 'Tenjo' },
        { value: 'tibacuy', label: 'Tibacuy' },
        { value: 'tibirita', label: 'Tibirita' },
        { value: 'tocaima', label: 'Tocaima' },
        { value: 'tocancipa', label: 'Tocancipa' },
        { value: 'topaipi', label: 'Topaipi' },
        { value: 'ubala', label: 'Ubala' },
        { value: 'ubaque', label: 'Ubaque' },
        { value: 'ubate', label: 'Ubate' },
        { value: 'une', label: 'Une' },
        { value: 'utica', label: 'Utica' },
        { value: 'vergara', label: 'Vergara' },
        { value: 'viani', label: 'Viani' },
        { value: 'villagomez', label: 'Villagomez' },
        { value: 'villapinzon', label: 'Villapinzon' },
        { value: 'villeta', label: 'Villeta' },
        { value: 'viota', label: 'Viota' },
        { value: 'yacopi', label: 'Yacopi' },
        { value: 'zipacon', label: 'Zipacon' },
        { value: 'zipaquira', label: 'Zipaquira' },
    ],
    guainia: [
        { value: 'inirida', label: 'Inirida' },
        { value: 'barrancominas', label: 'Barrancominas' },
        { value: 'mapiripana', label: 'Mapiripana' },
        { value: 'san_felipe', label: 'San Felipe' },
        { value: 'puerto_colombia', label: 'Puerto Colombia' },
        { value: 'la_guadalupe', label: 'La Guadalupe' },
        { value: 'cacahual', label: 'Cacahual' },
        { value: 'pana_pana', label: 'Pana Pana' },
        { value: 'morichal', label: 'Morichal' },
    ],
    la_guajira: [
        { value: 'riohacha', label: 'Riohacha' },
        { value: 'albania', label: 'Albania' },
        { value: 'barrancas', label: 'Barrancas' },
        { value: 'dibulla', label: 'Dibulla' },
        { value: 'distraccion', label: 'Distraccion' },
        { value: 'el_molino', label: 'El Molino' },
        { value: 'fonseca', label: 'Fonseca' },
        { value: 'hatonuevo', label: 'Hatonuevo' },
        { value: 'la_jagua_del_pilar', label: 'La Jagua del Pilar' },
        { value: 'maicao', label: 'Maicao' },
        { value: 'manaure', label: 'Manaure' },
        { value: 'san_juan_del_cesar', label: 'San Juan del Cesar' },
        { value: 'uribia', label: 'Uribia' },
        { value: 'urumita', label: 'Urumita' },
        { value: 'villanueva', label: 'Villanueva' },
    ],
    guaviare: [
        { value: 'san_jose_del_guaviare', label: 'San Jose del Guaviare' },
        { value: 'calamar', label: 'Calamar' },
        { value: 'el_retorno', label: 'El Retorno' },
        { value: 'miraflores', label: 'Miraflores' },
    ],
    huila: [
        { value: 'neiva', label: 'Neiva' },
        { value: 'acevedo', label: 'Acevedo' },
        { value: 'agrado', label: 'Agrado' },
        { value: 'aipe', label: 'Aipe' },
        { value: 'algeciras', label: 'Algeciras' },
        { value: 'altamira', label: 'Altamira' },
        { value: 'baraya', label: 'Baraya' },
        { value: 'campoalegre', label: 'Campoalegre' },
        { value: 'colombia', label: 'Colombia' },
        { value: 'elias', label: 'Elias' },
        { value: 'garzon', label: 'Garzon' },
        { value: 'gigante', label: 'Gigante' },
        { value: 'guadalupe', label: 'Guadalupe' },
        { value: 'hobo', label: 'Hobo' },
        { value: 'iquira', label: 'Iquira' },
        { value: 'isnos', label: 'Isnos' },
        { value: 'la_argentina', label: 'La Argentina' },
        { value: 'la_plata', label: 'La Plata' },
        { value: 'nataga', label: 'Nataga' },
        { value: 'oporapa', label: 'Oporapa' },
        { value: 'paicol', label: 'Paicol' },
        { value: 'palermo', label: 'Palermo' },
        { value: 'palestina', label: 'Palestina' },
        { value: 'pital', label: 'Pital' },
        { value: 'pitalito', label: 'Pitalito' },
        { value: 'rivera', label: 'Rivera' },
        { value: 'saladoblanco', label: 'Saladoblanco' },
        { value: 'san_agustin', label: 'San Agustin' },
        { value: 'santa_maria', label: 'Santa Maria' },
        { value: 'suaza', label: 'Suaza' },
        { value: 'tarqui', label: 'Tarqui' },
        { value: 'tesalia', label: 'Tesalia' },
        { value: 'tello', label: 'Tello' },
        { value: 'teruel', label: 'Teruel' },
        { value: 'timana', label: 'Timana' },
        { value: 'villavieja', label: 'Villavieja' },
        { value: 'yaguara', label: 'Yaguara' },
    ],
    magdalena: [
        { value: 'santa_marta', label: 'Santa Marta' },
        { value: 'algarrobo', label: 'Algarrobo' },
        { value: 'aracataca', label: 'Aracataca' },
        { value: 'ariguani', label: 'Ariguani' },
        { value: 'cerro_san_antonio', label: 'Cerro San Antonio' },
        { value: 'chivolo', label: 'Chivolo' },
        { value: 'cienaga', label: 'Cienaga' },
        { value: 'concordia', label: 'Concordia' },
        { value: 'el_banco', label: 'El Banco' },
        { value: 'el_pinon', label: 'El Piñon' },
        { value: 'el_reten', label: 'El Reten' },
        { value: 'fundacion', label: 'Fundacion' },
        { value: 'guamal', label: 'Guamal' },
        { value: 'nueva_granada', label: 'Nueva Granada' },
        { value: 'pedraza', label: 'Pedraza' },
        { value: 'pijino_del_carmen', label: 'Pijiño del Carmen' },
        { value: 'pivijay', label: 'Pivijay' },
        { value: 'plato', label: 'Plato' },
        { value: 'puebloviejo', label: 'Puebloviejo' },
        { value: 'remolino', label: 'Remolino' },
        { value: 'sabanas_de_san_angel', label: 'Sabanas de San Angel' },
        { value: 'salamina', label: 'Salamina' },
        { value: 'san_sebastian_de_buenavista', label: 'San Sebastian de Buenavista' },
        { value: 'san_zenon', label: 'San Zenon' },
        { value: 'santa_ana', label: 'Santa Ana' },
        { value: 'santa_barbara_de_pinto', label: 'Santa Barbara de Pinto' },
        { value: 'sitionuevo', label: 'Sitionuevo' },
        { value: 'tenerife', label: 'Tenerife' },
        { value: 'zapayan', label: 'Zapayan' },
        { value: 'zona_bananera', label: 'Zona Bananera' },
    ],
    meta: [
        { value: 'villavicencio', label: 'Villavicencio' },
        { value: 'acacias', label: 'Acacias' },
        { value: 'barranca_de_upia', label: 'Barranca de Upia' },
        { value: 'cabuyaro', label: 'Cabuyaro' },
        { value: 'castilla_la_nueva', label: 'Castilla la Nueva' },
        { value: 'cubarral', label: 'Cubarral' },
        { value: 'cumaral', label: 'Cumaral' },
        { value: 'el_calvario', label: 'El Calvario' },
        { value: 'el_castillo', label: 'El Castillo' },
        { value: 'el_dorado', label: 'El Dorado' },
        { value: 'fuente_de_oro', label: 'Fuente de Oro' },
        { value: 'granada', label: 'Granada' },
        { value: 'guamal', label: 'Guamal' },
        { value: 'mapiripan', label: 'Mapiripan' },
        { value: 'mesetas', label: 'Mesetas' },
        { value: 'la_macarena', label: 'La Macarena' },
        { value: 'la_uribe', label: 'La Uribe' },
        { value: 'lejanias', label: 'Lejanias' },
        { value: 'puerto_concordia', label: 'Puerto Concordia' },
        { value: 'puerto_gaitan', label: 'Puerto Gaitan' },
        { value: 'puerto_lopez', label: 'Puerto Lopez' },
        { value: 'puerto_lleras', label: 'Puerto Lleras' },
        { value: 'puerto_rico', label: 'Puerto Rico' },
        { value: 'restrepo', label: 'Restrepo' },
        { value: 'san_carlos_guaroa', label: 'San Carlos Guaroa' },
        { value: 'san_juan_de_arama', label: 'San Juan de Arama' },
        { value: 'san_juanito', label: 'San Juanito' },
        { value: 'san_martin', label: 'San Martin' },
        { value: 'vista_hermosa', label: 'Vista Hermosa' },
    ],
    narino: [
        { value: 'pasto', label: 'Pasto' },
        { value: 'alban', label: 'Alban' },
        { value: 'aldana', label: 'Aldana' },
        { value: 'ancuya', label: 'Ancuya' },
        { value: 'arboleda', label: 'Arboleda' },
        { value: 'barbacoas', label: 'Barbacoas' },
        { value: 'belen', label: 'Belen' },
        { value: 'buesaco', label: 'Buesaco' },
        { value: 'colon', label: 'Colon' },
        { value: 'consaca', label: 'Consaca' },
        { value: 'contadero', label: 'Contadero' },
        { value: 'cordoba', label: 'Cordoba' },
        { value: 'cuaspud', label: 'Cuaspud' },
        { value: 'cumbal', label: 'Cumbal' },
        { value: 'cumbitara', label: 'Cumbitara' },
        { value: 'chachagui', label: 'Chachagui' },
        { value: 'el_charco', label: 'El Charco' },
        { value: 'el_penol', label: 'El Peñol' },
        { value: 'el_rosario', label: 'El Rosario' },
        { value: 'el_tablon_de_gomez', label: 'El Tablon de Gomez' },
        { value: 'el_tambo', label: 'El Tambo' },
        { value: 'funes', label: 'Funes' },
        { value: 'guachucal', label: 'Guachucal' },
        { value: 'guaitarilla', label: 'Guaitarilla' },
        { value: 'gualmatan', label: 'Gualmatan' },
        { value: 'iles', label: 'Iles' },
        { value: 'imues', label: 'Imues' },
        { value: 'ipiales', label: 'Ipiales' },
        { value: 'la_cruz', label: 'La Cruz' },
        { value: 'la_florida', label: 'La Florida' },
        { value: 'la_llanada', label: 'La Llanada' },
        { value: 'la_tola', label: 'La Tola' },
        { value: 'la_union', label: 'La Union' },
        { value: 'leiva', label: 'Leiva' },
        { value: 'linares', label: 'Linares' },
        { value: 'los_andes', label: 'Los Andes' },
        { value: 'magui', label: 'Magui' },
        { value: 'mallama', label: 'Mallama' },
        { value: 'mosquera', label: 'Mosquera' },
        { value: 'narino', label: 'Nariño' },
        { value: 'olaya_herrera', label: 'Olaya Herrera' },
        { value: 'ospina', label: 'Ospina' },
        { value: 'francisco_pizarro', label: 'Francisco Pizarro' },
        { value: 'policarpa', label: 'Policarpa' },
        { value: 'potosi', label: 'Potosi' },
        { value: 'providencia', label: 'Providencia' },
        { value: 'puerres', label: 'Puerres' },
        { value: 'pupiales', label: 'Pupiales' },
        { value: 'ricaurte', label: 'Ricaurte' },
        { value: 'roberto_payan', label: 'Roberto Payan' },
        { value: 'samaniego', label: 'Samaniego' },
        { value: 'sandona', label: 'Sandona' },
        { value: 'san_bernardo', label: 'San Bernardo' },
        { value: 'san_lorenzo', label: 'San Lorenzo' },
        { value: 'san_pablo', label: 'San Pablo' },
        { value: 'san_pedro_de_cartago', label: 'San Pedro de Cartago' },
        { value: 'santa_barbara', label: 'Santa Barbara' },
        { value: 'santacruz', label: 'Santacruz' },
        { value: 'sapuyes', label: 'Sapuyes' },
        { value: 'taminango', label: 'Taminango' },
        { value: 'tangua', label: 'Tangua' },
        { value: 'tumaco', label: 'Tumaco' },
        { value: 'tuquerres', label: 'Tuquerres' },
        { value: 'yacuanquer', label: 'Yacuanquer' },
    ],
    norte_de_santander: [
        { value: 'cucuta', label: 'Cucuta' },
        { value: 'abrego', label: 'Abrego' },
        { value: 'arboledas', label: 'Arboledas' },
        { value: 'bochalema', label: 'Bochalema' },
        { value: 'bucarasica', label: 'Bucarasica' },
        { value: 'cacota', label: 'Cacota' },
        { value: 'cachira', label: 'Cachira' },
        { value: 'chinacota', label: 'Chinacota' },
        { value: 'chitaga', label: 'Chitaga' },
        { value: 'convencion', label: 'Convencion' },
        { value: 'cucutilla', label: 'Cucutilla' },
        { value: 'durania', label: 'Durania' },
        { value: 'el_carmen', label: 'El Carmen' },
        { value: 'el_tarra', label: 'El Tarra' },
        { value: 'el_zulia', label: 'El Zulia' },
        { value: 'gramalote', label: 'Gramalote' },
        { value: 'hacari', label: 'Hacari' },
        { value: 'herran', label: 'Herran' },
        { value: 'labateca', label: 'Labateca' },
        { value: 'la_esperanza', label: 'La Esperanza' },
        { value: 'la_playa', label: 'La Playa' },
        { value: 'los_patios', label: 'Los Patios' },
        { value: 'lourdes', label: 'Lourdes' },
        { value: 'mutiscua', label: 'Mutiscua' },
        { value: 'ocana', label: 'Ocaña' },
        { value: 'pamplona', label: 'Pamplona' },
        { value: 'pamplonita', label: 'Pamplonita' },
        { value: 'puerto_santander', label: 'Puerto Santander' },
        { value: 'ragonvalia', label: 'Ragonvalia' },
        { value: 'salazar', label: 'Salazar' },
        { value: 'san_calixto', label: 'San Calixto' },
        { value: 'san_cayetano', label: 'San Cayetano' },
        { value: 'santiago', label: 'Santiago' },
        { value: 'sardinata', label: 'Sardinata' },
        { value: 'silos', label: 'Silos' },
        { value: 'teorama', label: 'Teorama' },
        { value: 'tibu', label: 'Tibu' },
        { value: 'toledo', label: 'Toledo' },
        { value: 'villa_caro', label: 'Villa Caro' },
        { value: 'villa_del_rosario', label: 'Villa del Rosario' },
    ],
    putumayo: [
        { value: 'mocoa', label: 'Mocoa' },
        { value: 'colon', label: 'Colon' },
        { value: 'orito', label: 'Orito' },
        { value: 'puerto_asis', label: 'Puerto Asis' },
        { value: 'puerto_caicedo', label: 'Puerto Caicedo' },
        { value: 'puerto_guzman', label: 'Puerto Guzman' },
        { value: 'leguizamo', label: 'Leguizamo' },
        { value: 'sibundoy', label: 'Sibundoy' },
        { value: 'san_francisco', label: 'San Francisco' },
        { value: 'san_miguel', label: 'San Miguel' },
        { value: 'santiago', label: 'Santiago' },
        { value: 'valle_del_guamuez', label: 'Valle del Guamuez' },
        { value: 'villagarzon', label: 'Villagarzon' },
    ],
    quindio: [
        { value: 'armenia', label: 'Armenia' },
        { value: 'buenavista', label: 'Buenavista' },
        { value: 'calarca', label: 'Calarca' },
        { value: 'circasia', label: 'Circasia' },
        { value: 'cordoba', label: 'Cordoba' },
        { value: 'filandia', label: 'Filandia' },
        { value: 'genova', label: 'Genova' },
        { value: 'la_tebaida', label: 'La Tebaida' },
        { value: 'montenegro', label: 'Montenegro' },
        { value: 'pijao', label: 'Pijao' },
        { value: 'quimbaya', label: 'Quimbaya' },
        { value: 'salento', label: 'Salento' },
    ],
    risaralda: [
        { value: 'pereira', label: 'Pereira' },
        { value: 'apia', label: 'Apia' },
        { value: 'balboa', label: 'Balboa' },
        { value: 'belen_de_umbria', label: 'Belen de Umbria' },
        { value: 'dos_quebradas', label: 'Dos Quebradas' },
        { value: 'guatica', label: 'Guatica' },
        { value: 'la_celia', label: 'La Celia' },
        { value: 'la_virginia', label: 'La Virginia' },
        { value: 'marsella', label: 'Marsella' },
        { value: 'mistrato', label: 'Mistrato' },
        { value: 'pueblo_rico', label: 'Pueblo Rico' },
        { value: 'quinchia', label: 'Quinchia' },
        { value: 'santa_rosa_de_cabal', label: 'Santa Rosa de Cabal' },
        { value: 'santuario', label: 'Santuario' },
    ],
    san_andres_y_providencia: [
        { value: 'san_andres', label: 'San Andres' },
        { value: 'providencia', label: 'Providencia' },
    ],
    santander: [
        { value: 'bucaramanga', label: 'Bucaramanga' },
        { value: 'aguada', label: 'Aguada' },
        { value: 'albania', label: 'Albania' },
        { value: 'aratoca', label: 'Aratoca' },
        { value: 'barbosa', label: 'Barbosa' },
        { value: 'barichara', label: 'Barichara' },
        { value: 'barrancabermeja', label: 'Barrancabermeja' },
        { value: 'betulia', label: 'Betulia' },
        { value: 'bolivar', label: 'Bolivar' },
        { value: 'cabrera', label: 'Cabrera' },
        { value: 'california', label: 'California' },
        { value: 'capitanejo', label: 'Capitanejo' },
        { value: 'carcasi', label: 'Carcasi' },
        { value: 'cepita', label: 'Cepita' },
        { value: 'cerrito', label: 'Cerrito' },
        { value: 'charala', label: 'Charala' },
        { value: 'charta', label: 'Charta' },
        { value: 'chima', label: 'Chima' },
        { value: 'chipata', label: 'Chipata' },
        { value: 'cimitarra', label: 'Cimitarra' },
        { value: 'concepcion', label: 'Concepcion' },
        { value: 'confines', label: 'Confines' },
        { value: 'contratacion', label: 'Contratacion' },
        { value: 'coromoro', label: 'Coromoro' },
        { value: 'curiti', label: 'Curiti' },
        { value: 'el_carmen_de_chucuri', label: 'El Carmen de Chucuri' },
        { value: 'el_guacamayo', label: 'El Guacamayo' },
        { value: 'el_penon', label: 'El Peñon' },
        { value: 'el_playon', label: 'El Playon' },
        { value: 'encino', label: 'Encino' },
        { value: 'enciso', label: 'Enciso' },
        { value: 'florian', label: 'Florian' },
        { value: 'floridablanca', label: 'Floridablanca' },
        { value: 'galan', label: 'Galan' },
        { value: 'gambita', label: 'Gambita' },
        { value: 'giron', label: 'Giron' },
        { value: 'guaca', label: 'Guaca' },
        { value: 'guadalupe', label: 'Guadalupe' },
        { value: 'guapota', label: 'Guapota' },
        { value: 'guavata', label: 'Guavata' },
        { value: 'guepsa', label: 'Guepsa' },
        { value: 'hato', label: 'Hato' },
        { value: 'jesus_maria', label: 'Jesus Maria' },
        { value: 'jordan', label: 'Jordan' },
        { value: 'la_belleza', label: 'La Belleza' },
        { value: 'landazuri', label: 'Landazuri' },
        { value: 'la_paz', label: 'La Paz' },
        { value: 'lebrija', label: 'Lebrija' },
        { value: 'los_santos', label: 'Los Santos' },
        { value: 'macaravita', label: 'Macaravita' },
        { value: 'malaga', label: 'Malaga' },
        { value: 'matanza', label: 'Matanza' },
        { value: 'mogotes', label: 'Mogotes' },
        { value: 'molagavita', label: 'Molagavita' },
        { value: 'ocamonte', label: 'Ocamonte' },
        { value: 'oiba', label: 'Oiba' },
        { value: 'onzaga', label: 'Onzaga' },
        { value: 'palmar', label: 'Palmar' },
        { value: 'palmas_del_socorro', label: 'Palmas del Socorro' },
        { value: 'paramo', label: 'Paramo' },
        { value: 'piedecuesta', label: 'Piedecuesta' },
        { value: 'pinchote', label: 'Pinchote' },
        { value: 'puente_nacional', label: 'Puente Nacional' },
        { value: 'puerto_parra', label: 'Puerto Parra' },
        { value: 'puerto_wilches', label: 'Puerto Wilches' },
        { value: 'rionegro', label: 'Rionegro' },
        { value: 'sabana_de_torres', label: 'Sabana de Torres' },
        { value: 'san_andres', label: 'San Andres' },
        { value: 'san_benito', label: 'San Benito' },
        { value: 'san_gil', label: 'San Gil' },
        { value: 'san_joaquin', label: 'San Joaquin' },
        { value: 'san_jose_de_miranda', label: 'San Jose de Miranda' },
        { value: 'san_miguel', label: 'San Miguel' },
        { value: 'san_vicente_de_chucuri', label: 'San Vicente de Chucuri' },
        { value: 'santa_barbara', label: 'Santa Barbara' },
        { value: 'santa_helena_del_opon', label: 'Santa Helena del Opon' },
        { value: 'simacota', label: 'Simacota' },
        { value: 'socorro', label: 'Socorro' },
        { value: 'suaita', label: 'Suaita' },
        { value: 'sucre', label: 'Sucre' },
        { value: 'surata', label: 'Surata' },
        { value: 'tona', label: 'Tona' },
        { value: 'valle_de_san_jose', label: 'Valle de San Jose' },
        { value: 'velez', label: 'Velez' },
        { value: 'vetas', label: 'Vetas' },
        { value: 'villanueva', label: 'Villanueva' },
        { value: 'zapatoca', label: 'Zapatoca' },
    ],
    sucre: [
        { value: 'sincelejo', label: 'Sincelejo' },
        { value: 'buenavista', label: 'Buenavista' },
        { value: 'caimito', label: 'Caimito' },
        { value: 'coloso', label: 'Coloso' },
        { value: 'corozal', label: 'Corozal' },
        { value: 'covenas', label: 'Coveñas' },
        { value: 'chalan', label: 'Chalan' },
        { value: 'el_roble', label: 'El Roble' },
        { value: 'galeras', label: 'Galeras' },
        { value: 'guaranda', label: 'Guaranda' },
        { value: 'la_union', label: 'La Union' },
        { value: 'los_palmitos', label: 'Los Palmitos' },
        { value: 'majagual', label: 'Majagual' },
        { value: 'morroa', label: 'Morroa' },
        { value: 'ovejas', label: 'Ovejas' },
        { value: 'palmito', label: 'Palmito' },
        { value: 'sampues', label: 'Sampues' },
        { value: 'san_benito_abad', label: 'San Benito Abad' },
        { value: 'san_juan_betulia', label: 'San Juan Betulia' },
        { value: 'san_marcos', label: 'San Marcos' },
        { value: 'san_onofre', label: 'San Onofre' },
        { value: 'san_pedro', label: 'San Pedro' },
        { value: 'since', label: 'Since' },
        { value: 'sucre', label: 'Sucre' },
        { value: 'santiago_de_tolu', label: 'Santiago de Tolu' },
        { value: 'tolu_viejo', label: 'Tolu Viejo' },
    ],
    tolima: [
        { value: 'ibague', label: 'Ibague' },
        { value: 'alpujarra', label: 'Alpujarra' },
        { value: 'alvarado', label: 'Alvarado' },
        { value: 'ambalema', label: 'Ambalema' },
        { value: 'anzoategui', label: 'Anzoategui' },
        { value: 'armero', label: 'Armero' },
        { value: 'ataco', label: 'Ataco' },
        { value: 'cajamarca', label: 'Cajamarca' },
        { value: 'carmen_de_apicala', label: 'Carmen de Apicala' },
        { value: 'casabianca', label: 'Casabianca' },
        { value: 'chaparral', label: 'Chaparral' },
        { value: 'coello', label: 'Coello' },
        { value: 'coyaima', label: 'Coyaima' },
        { value: 'cunday', label: 'Cunday' },
        { value: 'dolores', label: 'Dolores' },
        { value: 'espinal', label: 'Espinal' },
        { value: 'falan', label: 'Falan' },
        { value: 'flandes', label: 'Flandes' },
        { value: 'fresno', label: 'Fresno' },
        { value: 'guamo', label: 'Guamo' },
        { value: 'herveo', label: 'Herveo' },
        { value: 'honda', label: 'Honda' },
        { value: 'icononzo', label: 'Icononzo' },
        { value: 'lerida', label: 'Lerida' },
        { value: 'libano', label: 'Libano' },
        { value: 'mariquita', label: 'Mariquita' },
        { value: 'melgar', label: 'Melgar' },
        { value: 'murillo', label: 'Murillo' },
        { value: 'natagaima', label: 'Natagaima' },
        { value: 'ortega', label: 'Ortega' },
        { value: 'palocabildo', label: 'Palocabildo' },
        { value: 'piedras', label: 'Piedras' },
        { value: 'planadas', label: 'Planadas' },
        { value: 'prado', label: 'Prado' },
        { value: 'purificacion', label: 'Purificacion' },
        { value: 'rioblanco', label: 'Rioblanco' },
        { value: 'roncesvalles', label: 'Roncesvalles' },
        { value: 'rovira', label: 'Rovira' },
        { value: 'saldana', label: 'Saldaña' },
        { value: 'san_antonio', label: 'San Antonio' },
        { value: 'san_luis', label: 'San Luis' },
        { value: 'santa_isabel', label: 'Santa Isabel' },
        { value: 'suarez', label: 'Suarez' },
        { value: 'valle_de_san_juan', label: 'Valle de San Juan' },
        { value: 'venadillo', label: 'Venadillo' },
        { value: 'villahermosa', label: 'Villahermosa' },
        { value: 'villarrica', label: 'Villarrica' },
    ],
    valle_del_cauca: [
        { value: 'cali', label: 'Cali' },
        { value: 'alcala', label: 'Alcala' },
        { value: 'andalucia', label: 'Andalucia' },
        { value: 'ansermanuevo', label: 'Ansermanuevo' },
        { value: 'argelia', label: 'Argelia' },
        { value: 'bolivar', label: 'Bolivar' },
        { value: 'buenaventura', label: 'Buenaventura' },
        { value: 'buga', label: 'Buga' },
        { value: 'bugalagrande', label: 'Bugalagrande' },
        { value: 'caicedonia', label: 'Caicedonia' },
        { value: 'calima', label: 'Calima' },
        { value: 'candelaria', label: 'Candelaria' },
        { value: 'cartago', label: 'Cartago' },
        { value: 'dagua', label: 'Dagua' },
        { value: 'el_aguila', label: 'El Aguila' },
        { value: 'el_cairo', label: 'El Cairo' },
        { value: 'el_cerrito', label: 'El Cerrito' },
        { value: 'el_dovio', label: 'El Dovio' },
        { value: 'florida', label: 'Florida' },
        { value: 'ginebra', label: 'Ginebra' },
        { value: 'guacari', label: 'Guacari' },
        { value: 'jamundi', label: 'Jamundi' },
        { value: 'la_cumbre', label: 'La Cumbre' },
        { value: 'la_union', label: 'La Union' },
        { value: 'la_victoria', label: 'La Victoria' },
        { value: 'obando', label: 'Obando' },
        { value: 'palmira', label: 'Palmira' },
        { value: 'pradera', label: 'Pradera' },
        { value: 'restrepo', label: 'Restrepo' },
        { value: 'riofrio', label: 'Riofrio' },
        { value: 'roldanillo', label: 'Roldanillo' },
        { value: 'san_pedro', label: 'San Pedro' },
        { value: 'sevilla', label: 'Sevilla' },
        { value: 'toro', label: 'Toro' },
        { value: 'trujillo', label: 'Trujillo' },
        { value: 'tulua', label: 'Tulua' },
        { value: 'ulloa', label: 'Ulloa' },
        { value: 'versalles', label: 'Versalles' },
        { value: 'vijes', label: 'Vijes' },
        { value: 'yotoco', label: 'Yotoco' },
        { value: 'yumbo', label: 'Yumbo' },
        { value: 'zarzal', label: 'Zarzal' },
    ],
    vaupes: [
        { value: 'mitu', label: 'Mitu' },
        { value: 'caruru', label: 'Caruru' },
        { value: 'pacoa', label: 'Pacoa' },
        { value: 'taraira', label: 'Taraira' },
        { value: 'papunahua', label: 'Papunahua' },
        { value: 'yavarate', label: 'Yavarate' },
    ],
    vichada: [
        { value: 'puerto_carreno', label: 'Puerto Carreño' },
        { value: 'la_primavera', label: 'La Primavera' },
        { value: 'santa_rosalia', label: 'Santa Rosalia' },
        { value: 'cumaribo', label: 'Cumaribo' },
    ],
};

const tiposPaciente = [
    { value: 'menor_de_edad', label: 'Menor de edad' },
    { value: 'adulto', label: 'Adulto' },
    { value: 'gestante', label: 'Gestante' },
];

// 🎯 Función para determinar tipo de paciente basado en edad y sexo
const determinarTipoPaciente = (edad: number, sexo?: string): string => {
    // Menor de edad: < 18 años
    if (edad < 18) {
        return 'menor_de_edad';
    }
    
    // Gestante: mujer adulta (por defecto, se puede cambiar manualmente si no es gestante)
    if (sexo && (sexo.toLowerCase() === 'femenino' || sexo.toLowerCase() === 'mujer')) {
        // Por defecto gestante para mujeres adultas - el médico puede cambiar si no aplica
        return 'gestante';
    }
    
    // Adulto: ≥ 18 años (hombres o cuando no se especifica sexo)
    return 'adulto';
};

const escalasGlasgow = [
    { value: '15', label: '15 - Normal' },
    { value: '14', label: '14 - Leve' },
    { value: '13', label: '13 - Leve' },
    { value: '12', label: '12 - Moderado' },
    { value: '11', label: '11 - Moderado' },
    { value: '10', label: '10 - Moderado' },
    { value: '9', label: '9 - Moderado' },
    { value: '8', label: '8 - Severo' },
    { value: '7', label: '7 - Severo' },
    { value: '6', label: '6 - Severo' },
    { value: '5', label: '5 - Severo' },
    { value: '4', label: '4 - Severo' },
    { value: '3', label: '3 - Severo' },
];

const tiposSolicitud = [
    { value: 'solicitud_remision', label: 'Solicitud de remisión' },
    { value: 'solicitud_traslado_redondo', label: 'Solicitud traslado redondo' },
];

const especialidades = [
    { value: 'anestesia', label: 'Anestesia' },
    { value: 'cardiologia', label: 'Cardiología' },
    { value: 'cardiologia_pediatrica', label: 'Cardiología Pediátrica' },
    { value: 'cirugia_bariatrica', label: 'Cirugía Bariátrica' },
    { value: 'cirugia_cardiovascular', label: 'Cirugía Cardiovascular' },
    { value: 'cirugia_cabeza_cuello', label: 'Cirugía De Cabeza Y Cuello' },
    { value: 'cirugia_epilepsia', label: 'Cirugía de Epilepsia' },
    { value: 'cirugia_mano', label: 'Cirugía De La Mano' },
    { value: 'cirugia_mama_tumores', label: 'Cirugía De Mama Y Tumores Tejidos Blandos' },
    { value: 'cirugia_mano_alt', label: 'Cirugía De Mano' },
    { value: 'cirugia_torax', label: 'Cirugía De Tórax' },
    { value: 'cirugia_trauma', label: 'Cirugía de Trauma' },
    { value: 'cirugia_dermatologica', label: 'Cirugía Dermatológica' },
    { value: 'cirugia_gastrointestinal', label: 'Cirugía Gastrointestinal' },
    { value: 'cirugia_general', label: 'Cirugía General' },
    { value: 'cirugia_ginecologica', label: 'Cirugía Ginecológica' },
    { value: 'cirugia_ginecologica_laparoscopica', label: 'Cirugía Ginecológica Laparoscópica' },
    { value: 'cirugia_maxilofacial', label: 'Cirugía Maxilofacial' },
    { value: 'cirugia_oftalmologica', label: 'Cirugía Oftalmológica' },
    { value: 'cirugia_oncologica', label: 'Cirugía Oncológica' },
    { value: 'cirugia_oncologica_pediatrica', label: 'Cirugía Oncológica Pediátrica' },
    { value: 'cirugia_oral', label: 'Cirugía Oral' },
    { value: 'cirugia_ortopedica', label: 'Cirugía Ortopédica' },
    { value: 'cirugia_otorrinolaringologia', label: 'Cirugía Otorrinolaringología' },
    { value: 'cirugia_pediatrica', label: 'Cirugía Pediátrica' },
    { value: 'cirugia_plastica_estetica', label: 'Cirugía Plástica Y Estética' },
    { value: 'cirugia_urologica', label: 'Cirugía Urológica' },
    { value: 'cirugia_vascular_periferica', label: 'Cirugía Vascular Periférica' },
    { value: 'dermatologia', label: 'Dermatología' },
    { value: 'dolor_cuidados_paliativos', label: 'Dolor Y Cuidados Paliativos' },
    { value: 'endocrinologia', label: 'Endocrinología' },
    { value: 'endodoncia', label: 'Endodoncia' },
    { value: 'gastroenterologia', label: 'Gastroenterología' },
    { value: 'genetica', label: 'Genética' },
    { value: 'geriatria', label: 'Geriatría' },
    { value: 'ginecobstetricia', label: 'Ginecobstetricia' },
    { value: 'ginecologia_oncologica', label: 'Ginecología Oncológica' },
    { value: 'hematologia', label: 'Hematología' },
    { value: 'hematologia_oncologica', label: 'Hematología Oncológica' },
    { value: 'infectologia', label: 'Infectología' },
    { value: 'inmunologia', label: 'Inmunología' },
    { value: 'medicina_emergencias', label: 'Medicina de Emergencias' },
    { value: 'medicina_fisica_rehabilitacion', label: 'Medicina Física Y Rehabilitación' },
    { value: 'medicina_interna', label: 'Medicina Interna' },
    { value: 'medicina_nuclear', label: 'Medicina nuclear' },
    { value: 'nefrologia', label: 'Nefrología' },
    { value: 'nefrologia_pediatrica', label: 'Nefrología Pediátrica' },
    { value: 'neonatologia', label: 'Neonatología' },
    { value: 'neumologia', label: 'Neumología' },
    { value: 'neumologia_pediatrica', label: 'Neumología Pediátrica' },
    { value: 'neurocirugia', label: 'Neurocirugía' },
    { value: 'neurologia', label: 'Neurología' },
    { value: 'neurologia_pediatrica', label: 'Neurología pediátrica' },
    { value: 'neuroradiologia_intervencionista', label: 'Neurorradiología intervencionista' },
    { value: 'odontopediatria', label: 'Odontopediatría' },
    { value: 'oftalmologia', label: 'Oftalmología' },
    { value: 'oftalmologia_pediatrica', label: 'Oftalmología pediátrica' },
    { value: 'oncologia_clinica', label: 'Oncología Clínica' },
    { value: 'oncologia_hematologia_pediatrica', label: 'Oncología Y Hematología Pediátrica' },
    { value: 'ortopedia_oncologica', label: 'Ortopedia Oncológica' },
    { value: 'ortopedia_pediatrica', label: 'Ortopedia Pediátrica' },
    { value: 'ortopedia_traumatologia', label: 'Ortopedia Y/O Traumatología' },
    { value: 'otoneurologia', label: 'Otoneurología' },
    { value: 'otorrinolaringologia', label: 'Otorrinolaringología' },
    { value: 'patologia', label: 'Patología' },
    { value: 'pediatria', label: 'Pediatría' },
    { value: 'periodoncia', label: 'Periodoncia' },
    { value: 'psiquiatria', label: 'Psiquiatría' },
    { value: 'radiologia_intervencionista', label: 'Radiología intervencionista' },
    { value: 'radioterapia', label: 'Radioterapia' },
    { value: 'reumatologia', label: 'Reumatología' },
    { value: 'toxicologia', label: 'Toxicología' },
    { value: 'urologia', label: 'Urología' },
    { value: 'cirugia_hepatobilliar', label: 'Cirugía hepatobilliar' },
    { value: 'cirugia_cabeza_cuello_alt', label: 'Cirugía de cabeza y cuello' },
    { value: 'infectologia_pediatrica', label: 'Infectología pediátrica' },
    { value: 'neurologia_pediatrica_alt', label: 'Neurología pediátrica' },
    { value: 'nefrologia_pediatrica_alt', label: 'Nefrología pediátrica' },
    { value: 'cardiologia_pediatrica_alt', label: 'Cardiología pediátrica' },
    { value: 'reumatologia_pediatrica', label: 'Reumatología pediátrica' },
    { value: 'neumologia_pediatrica_alt', label: 'Neumología pediátrica' },
    { value: 'gastroenterologia_pediatrica', label: 'Gastroenterología pediátrica' },
    { value: 'hematooncologia_pediatrica', label: 'Hematooncología pediátrica' },
    { value: 'cuidados_intensivos', label: 'Cuidados intensivos' },
];

const tiposServicio = [
    { value: 'atencion_parto', label: 'Atención Del Parto' },
    { value: 'cuidado_intermedio_neonatal', label: 'Cuidado Intermedio Neonatal' },
    { value: 'cuidado_intermedio_pediatrico', label: 'Cuidado Intermedio Pediátrico' },
    { value: 'cuidado_intermedio_adultos', label: 'Cuidado Intermedio Adultos' },
    { value: 'cuidado_intensivo_neonatal', label: 'Cuidado Intensivo Neonatal' },
    { value: 'cuidado_intensivo_pediatrico', label: 'Cuidado Intensivo Pediátrico' },
    { value: 'cuidado_intensivo_adultos', label: 'Cuidado Intensivo Adultos' },
    { value: 'cuidado_intensivo_cardiovascular', label: 'Cuidado Intensivo Cardiovascular' },
    { value: 'cuidado_intensivo_oncologico', label: 'Cuidado Intensivo Oncológico' },
    { value: 'cuidado_intensivo_trasplantes', label: 'Cuidado Intensivo Trasplantes' },
    { value: 'cuidado_intensivo_infecciosos', label: 'Cuidado Intensivo Infecciosos' },
    { value: 'hospitalizacion_neonatal', label: 'Hospitalización Neonatal' },
    { value: 'hospitalizacion_adultos', label: 'Hospitalización Adultos' },
    { value: 'hospitalizacion_pediatrica', label: 'Hospitalización Pediátrica' },
    { value: 'hospitalizacion_salud_mental', label: 'Hospitalización En Salud Mental' },
    { value: 'hospitalizacion_cuidado_especial_adulto', label: 'Hospitalización de Cuidado Especial Adulto (Infectados)' },
    { value: 'hospitalizacion_cuidado_especial_pediatrico', label: 'Hospitalización de Cuidado Especial Pediátrico (Respiratorios, Infectados)' },
    { value: 'unidad_hemodinamia', label: 'Unidad de Hemodinamia' },
    { value: 'cardiologia_no_invasiva', label: 'Cardiología no invasiva' },
    { value: 'quimioterapia', label: 'Quimioterapia' },
    { value: 'radioterapia', label: 'Radioterapia' },
    { value: 'banco_sangre', label: 'Banco de Sangre' },
    { value: 'servicio_quirurgico', label: 'Servicio Quirúrgico' },
    { value: 'unidad_endoscopia', label: 'Unidad de Endoscopia' },
    { value: 'patologia', label: 'Patología' },
    { value: 'unidad_trasplante', label: 'Unidad de Trasplante (Riñón, cornea, hueso)' },
    { value: 'unidad_quemados', label: 'Unidad de Quemados' },
    { value: 'enfermedades_huerfanas', label: 'Enfermedades Huérfanas' },
    { value: 'unidad_cuidado_paliativo', label: 'Unidad de Cuidado Paliativo' },
    { value: 'consultorio_rosa', label: 'Consultorio Rosa' },
    { value: 'medicina_general', label: 'Medicina General' },
    { value: 'hospitalizacion_general', label: 'Hospitalización General' },
];

const tiposApoyo = [
    { value: 'radiografia', label: 'Radiografía' },
    { value: 'ecografia', label: 'Ecografía' },
    { value: 'tomografia_computarizada_simple_contrastada', label: 'Tomografía computarizada simple o contrastada' },
    { value: 'tomografia_emision_positrones', label: 'Tomografía por emisión de positrones' },
    { value: 'tomografia_perfusion', label: 'Tomografía con perfusión' },
    { value: 'resonancia_magnetica_simple', label: 'Resonancia magnética simple' },
    { value: 'resonancia_magnetica_contrastada', label: 'Resonancia magnética contrastada' },
    { value: 'resonancia_magnetica_perfusion', label: 'Resonancia magnética con perfusión' },
    { value: 'colangiorresonancia', label: 'Colangiorresonancia' },
    { value: 'angiografia', label: 'Angiografía' },
    { value: 'gammagrafia', label: 'Gammagrafía' },
    { value: 'ecocardiograma_transtoracico', label: 'Ecocardiograma transtorácico' },
    { value: 'ecocardiograma_transesofagico', label: 'Ecocardiograma transesofágico' },
    { value: 'ecocardiograma_estres', label: 'Ecocardiograma estrés' },
    { value: 'otros_apoyos_imagen', label: 'Otros apoyos de imagen (pregunta abierta)' },
    { value: 'esofagogastroduodenoscopia', label: 'Esofagogastroduodenoscopia (Endoscopia de vías digestivas altas)' },
    { value: 'colangiopancreatografia_retrograda_endoscopica', label: 'Colangiopancreatografía retrógrada endoscópica (CPRE)' },
    { value: 'colonoscopia', label: 'Colonoscopia' },
    { value: 'nasofibrolaringoscopia', label: 'Nasofibrolaringoscopia' },
    { value: 'fibrobroncoscopia', label: 'Fibrobroncoscopia' },
    { value: 'videocapsula_endoscopica', label: 'Videocápsula endoscópica' },
    { value: 'biopsia_guiada_ecografia', label: 'Biopsia guiada por ecografía' },
    { value: 'biopsia_guiada_tomografia', label: 'Biopsia guiada por tomografía' },
    { value: 'cistoscopia', label: 'Cistoscopia' },
    { value: 'urodinamia', label: 'Urodinamia' },
    { value: 'biopsia_medula_osea', label: 'Biopsia de médula ósea' },
    { value: 'otros_apoyos_diagnosticos_quirurgicos', label: 'Otros apoyos diagnósticos quirúrgicos (pregunta abierta)' },
    { value: 'electromiografia_neuroconduccion', label: 'Electromiografía con neuroconducción' },
    { value: 'electroencefalografia', label: 'Electroencefalografía' },
    { value: 'videotelemetria', label: 'Videotelemetría' },
];

export default function IngresarRegistro() {
    const { props } = usePage();
    const userRole = (props.auth as any)?.user?.role || 'medico';
    const [currentStep, setCurrentStep] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [isAnalyzingWithAI, setIsAnalyzingWithAI] = useState(false);
    const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);
    const [isSavingRecord, setIsSavingRecord] = useState(false);
    const [searchCIE10, setSearchCIE10] = useState('');
    const [debouncedSearchCIE10, setDebouncedSearchCIE10] = useState('');
    const [searchCIE10_1, setSearchCIE10_1] = useState('');
    const [debouncedSearchCIE10_1, setDebouncedSearchCIE10_1] = useState('');
    const [searchCIE10_2, setSearchCIE10_2] = useState('');
    const [debouncedSearchCIE10_2, setDebouncedSearchCIE10_2] = useState('');
    const [codigosCIE10, setCodigosCIE10] = useState<Array<{value: string, label: string}>>([]);
    const [loadingCIE10, setLoadingCIE10] = useState(true);
    const [searchInstitucion, setSearchInstitucion] = useState('');
    const [debouncedSearchInstitucion, setDebouncedSearchInstitucion] = useState('');
    const [instituciones, setInstituciones] = useState<Array<{
        value: string;
        label: string;
        tipo?: 'nacional' | 'policia';
        codigo?: number;
        departamento?: string;
        municipio?: string;
    }>>([]);
    const [loadingInstituciones, setLoadingInstituciones] = useState(true);
    const [searchEspecialidad, setSearchEspecialidad] = useState('');

    // 📥 Cargar códigos CIE-10 desde JSON
    useEffect(() => {
        const cargarCodigosCIE10 = async () => {
            try {
                setLoadingCIE10(true);
                
                const response = await fetch('/TablaCIE10.json');
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                
                const datos = await response.json();
                
                // Transformar datos del JSON al formato requerido
                const codigosFormateados = datos.map((item: any) => ({
                    value: item.Codigo,
                    label: `${item.Codigo} - ${item.Nombre}`
                }));
                
                setCodigosCIE10(codigosFormateados);
                
            } catch (error) {
                console.error('❌ Error cargando códigos CIE-10:', error);
                toast.error('Error al cargar códigos CIE-10. Por favor recarga la página.');
                
                // Códigos de respaldo en caso de error
                setCodigosCIE10([
                    { value: 'A000', label: 'A000 - COLERA DEBIDO A VIBRIO CHOLERAE 01, BIOTIPO CHOLERAE' },
                    { value: 'I10X', label: 'I10X - HIPERTENSION ESENCIAL (PRIMARIA)' },
                    { value: 'E119', label: 'E119 - DIABETES MELLITUS NO INSULINODEPENDIENTE' }
                ]);
            } finally {
                setLoadingCIE10(false);
            }
        };
        
        cargarCodigosCIE10();
    }, []);

    // 📥 Cargar instituciones desde JSON (IPS Nacional + IPS Policía)
    useEffect(() => {
        const cargarInstituciones = async () => {
            try {
                setLoadingInstituciones(true);
                
                const response = await fetch('/Prestservi.json');
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                
                const datos = await response.json();
                
                // Procesar IPS Nacional (usan "sede_nombre" y "codigo_habilitacion")
                const ipsNacional = datos['IPS Nacional'] || [];
                const institucionesNacionales = ipsNacional.map((item: any) => ({
                    value: item.sede_nombre,
                    label: item.sede_nombre,
                    codigo: item.codigo_habilitacion,
                    departamento: item.depa_nombre,
                    municipio: item.muni_nombre,
                    tipo: 'nacional'
                }));
                
                // Procesar IPS Policía Nacional (usan "NOMBRE" y "DEPARTAMENTO")
                const ipsPolicia = datos['IPS Policia Nacional'] || [];
                const institucionesPolicia = ipsPolicia.map((item: any) => ({
                    value: item.NOMBRE,
                    label: item.NOMBRE,
                    departamento: item.DEPARTAMENTO,
                    tipo: 'policia'
                }));
                
                // Combinar ambas listas
                const todasLasInstituciones = [...institucionesNacionales, ...institucionesPolicia];
                
                // Ordenar alfabéticamente por label
                todasLasInstituciones.sort((a, b) => a.label.localeCompare(b.label));
                
                setInstituciones(todasLasInstituciones);
                
            } catch (error) {
                console.error('❌ Error cargando instituciones:', error);
                toast.error('Error al cargar instituciones. Por favor recarga la página.');
                
                // Instituciones de respaldo en caso de error
                setInstituciones([
                    { value: 'HOSPITAL UNIVERSITARIO SAN IGNACIO', label: 'HOSPITAL UNIVERSITARIO SAN IGNACIO', tipo: 'nacional' },
                    { value: 'FUNDACIÓN SANTA FE DE BOGOTÁ', label: 'FUNDACIÓN SANTA FE DE BOGOTÁ', tipo: 'nacional' },
                    { value: 'CLÍNICA SHAIO', label: 'CLÍNICA SHAIO', tipo: 'nacional' }
                ]);
            } finally {
                setLoadingInstituciones(false);
            }
        };
        
        cargarInstituciones();
    }, []);

    // 🔄 Debounce para búsquedas CIE-10 (mejor rendimiento)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchCIE10(searchCIE10);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchCIE10]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchCIE10_1(searchCIE10_1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchCIE10_1]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchCIE10_2(searchCIE10_2);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchCIE10_2]);

    // 🔄 Debounce para búsqueda de instituciones
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchInstitucion(searchInstitucion);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInstitucion]);

    // 📱 Cerrar dropdowns al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (!target.closest('[data-cie10-dropdown]')) {
                setSearchCIE10('');
                setSearchCIE10_1('');
                setSearchCIE10_2('');
            }
            if (!target.closest('[data-institucion-dropdown]')) {
                setSearchInstitucion('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Función para mapear tipos de identificación de IA a valores del frontend
    const mapTipoIdentificacion = (tipoIA: string): string => {
        const mappings: Record<string, string> = {
            'CC': 'cc',         // Cédula de Ciudadanía
            'TI': 'ti',         // Tarjeta de Identidad  
            'RC': 'rc',         // Registro Civil
            'CE': 'ce',         // Cédula de Extranjería
            'PA': 'pp',         // Pasaporte (PA -> pp)
            'AS': 'cc',         // Adulto Sin Identificación -> default CC
            'MS': 'rc',         // Menor Sin Identificación -> default RC
            // También mapear valores ya en minúsculas por si acaso
            'cc': 'cc',
            'ti': 'ti', 
            'rc': 'rc',
            'ce': 'ce',
            'pp': 'pp'
        };
        
        const mapped = mappings[tipoIA?.toUpperCase()] || mappings[tipoIA?.toLowerCase()];
        console.log(`Mapeando tipo identificación: "${tipoIA}" -> "${mapped}"`);
        return mapped || '';
    };

    // Función para mapear departamentos extraídos por IA a valores del frontend
    const mapDepartamento = (departamentoIA: string): string => {
        const mappings: Record<string, string> = {
            // Nombres completos de todos los departamentos de Colombia
            'AMAZONAS': 'amazonas',
            'ANTIOQUIA': 'antioquia',
            'ARAUCA': 'arauca',
            'ATLÁNTICO': 'atlantico',
            'ATLANTICO': 'atlantico',
            'BOLÍVAR': 'bolivar',
            'BOLIVAR': 'bolivar',
            'BOYACÁ': 'boyaca',
            'BOYACA': 'boyaca',
            'CALDAS': 'caldas',
            'CAQUETÁ': 'caqueta',
            'CAQUETA': 'caqueta',
            'CASANARE': 'casanare',
            'CAUCA': 'cauca',
            'CESAR': 'cesar',
            'CHOCÓ': 'choco',
            'CHOCO': 'choco',
            'CÓRDOBA': 'cordoba',
            'CORDOBA': 'cordoba',
            'CUNDINAMARCA': 'cundinamarca',
            'GUAINÍA': 'guainia',
            'GUAINIA': 'guainia',
            'GUAVIARE': 'guaviare',
            'HUILA': 'huila',
            'LA GUAJIRA': 'la_guajira',
            'GUAJIRA': 'la_guajira',
            'MAGDALENA': 'magdalena',
            'META': 'meta',
            'NARIÑO': 'narino',
            'NARINO': 'narino',
            'NORTE DE SANTANDER': 'norte_santander',
            'NORTE SANTANDER': 'norte_santander',
            'N. SANTANDER': 'norte_santander',
            'PUTUMAYO': 'putumayo',
            'QUINDÍO': 'quindio',
            'QUINDIO': 'quindio',
            'RISARALDA': 'risaralda',
            'SAN ANDRÉS Y PROVIDENCIA': 'san_andres',
            'SAN ANDRES Y PROVIDENCIA': 'san_andres',
            'SAN ANDRÉS': 'san_andres',
            'SAN ANDRES': 'san_andres',
            'SANTANDER': 'santander',
            'SUCRE': 'sucre',
            'TOLIMA': 'tolima',
            'VALLE DEL CAUCA': 'valle_del_cauca',
            'VALLE': 'valle_del_cauca',
            'VAUPÉS': 'vaupes',
            'VAUPES': 'vaupes',
            'VICHADA': 'vichada',
            
            // Abreviaciones comunes
            'AMA': 'amazonas',
            'ANT': 'antioquia',
            'ARA': 'arauca',
            'ATL': 'atlantico',
            'BOL': 'bolivar',
            'BOY': 'boyaca',
            'CAL': 'caldas',
            'CAQ': 'caqueta',
            'CAS': 'casanare',
            'CAU': 'cauca',
            'CES': 'cesar',
            'CHO': 'choco',
            'COR': 'cordoba',
            'CUN': 'cundinamarca',
            'GUA': 'guainia',
            'GUV': 'guaviare',
            'HUI': 'huila',
            'LAG': 'la_guajira',
            'MAG': 'magdalena',
            'MET': 'meta',
            'NAR': 'narino',
            'NSA': 'norte_santander',
            'PUT': 'putumayo',
            'QUI': 'quindio',
            'RIS': 'risaralda',
            'SAP': 'san_andres',
            'SAN': 'santander',
            'SUC': 'sucre',
            'TOL': 'tolima',
            'VAL': 'valle',
            'VAU': 'vaupes',
            'VIC': 'vichada'
        };
        
        const departamentoUpper = departamentoIA?.toUpperCase().trim();
        const mapped = mappings[departamentoUpper];
        console.log(`Mapeando departamento: "${departamentoIA}" -> "${mapped}"`);
        return mapped || '';
    };

    // Función INTELIGENTE para mapear ciudades extraídas por IA a valores del frontend
    const mapCiudad = (ciudadIA: string, departamento?: string): string => {
        if (!ciudadIA) return '';
        
        const ciudadUpper = ciudadIA.toUpperCase().trim();
        
        // Función auxiliar para normalizar texto (sin tildes, espacios, etc.)
        const normalizar = (texto: string): string => {
            return texto.toUpperCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") // Quitar tildes/acentos
                .trim();
        };
        
        // Si tenemos departamento, buscar en las ciudades de ese departamento
        if (departamento && ciudadesPorDepartamento[departamento]) {
            const ciudadesDelDepartamento = ciudadesPorDepartamento[departamento];
            
            // 1. Búsqueda exacta (sin tildes)
            for (const ciudad of ciudadesDelDepartamento) {
                if (normalizar(ciudad.label) === normalizar(ciudadIA)) {
                    console.log(`🎯 Ciudad encontrada (exacta): "${ciudadIA}" -> "${ciudad.value}"`);
                    return ciudad.value;
                }
            }
            
            // 2. Búsqueda por palabras clave (contiene)
            for (const ciudad of ciudadesDelDepartamento) {
                const labelNormalizado = normalizar(ciudad.label);
                const ciudadNormalizada = normalizar(ciudadIA);
                
                if (labelNormalizado.includes(ciudadNormalizada) || ciudadNormalizada.includes(labelNormalizado)) {
                    console.log(`🔍 Ciudad encontrada (contiene): "${ciudadIA}" -> "${ciudad.value}"`);
                    return ciudad.value;
                }
            }
        }
        
        // 3. Fallback: Mapeo hardcodeado para casos especiales comunes
        const mappingsFallback: Record<string, string> = {
            // Antioquia
            'MEDELLÍN': 'medellin',
            'MEDELLIN': 'medellin',
            'MED': 'medellin',
            'BELLO': 'bello',
            'ITAGÜÍ': 'itagui',
            'ITAGUI': 'itagui',
            'ENVIGADO': 'envigado',
            
            // Bogotá
            'BOGOTÁ D.C.': 'bogota',
            'BOGOTÁ': 'bogota', 
            'BOGOTA': 'bogota',
            'BOG': 'bogota',
            
            // Valle del Cauca
            'CALI': 'cali',
            'PALMIRA': 'palmira',
            'BUENAVENTURA': 'buenaventura',
            
            // Cauca
            'POPAYÁN': 'popayan',
            'POPAYAN': 'popayan',
            'POP': 'popayan',
            
            // Cundinamarca
            'SOACHA': 'soacha',
            'FACATATIVÁ': 'facatativa',
            'FACATATIVA': 'facatativa',
            'ZIPAQUIRÁ': 'zipaquira',
            'ZIPAQUIRA': 'zipaquira',
            
            // Risaralda - casos comunes
            'APIA': 'apia',
            'PEREIRA': 'pereira'
        };
        
        const mappedFallback = mappingsFallback[ciudadUpper];
        if (mappedFallback) {
            console.log(`📋 Ciudad mapeada (fallback): "${ciudadIA}" -> "${mappedFallback}"`);
            return mappedFallback;
        }
        
        console.log(`❌ Ciudad NO encontrada: "${ciudadIA}" (dept: ${departamento})`);
        return '';
    };

    // Función para mapear asegurador extraído por IA a valores del frontend
    const mapAsegurador = (aseguradorIA: string): string => {
        const mappings: Record<string, string> = {
            // ✅ NUEVAS CATEGORÍAS DEL SISTEMA DE SALUD COLOMBIANO
            
            // ADRES (Administradora de los Recursos del Sistema General de Seguridad Social en Salud)
            'ADRES': 'adres',
            'ADMINISTRADORA DE LOS RECURSOS': 'adres',
            
            // ARL (Administradora de Riesgos Laborales)
            'ARL': 'arl',
            'ADMINISTRADORA DE RIESGOS LABORALES': 'arl',
            'RIESGOS LABORALES': 'arl',
            'POSITIVA': 'arl',
            'SURA ARL': 'arl',
            'COLMENA ARL': 'arl',
            'MAPFRE ARL': 'arl',
            
            // EPS (Entidad Promotora de Salud) - Todas las EPS van aquí
            'EPS': 'eps',
            'ENTIDAD PROMOTORA DE SALUD': 'eps',
            'SANITAS': 'eps',
            'EPS SANITAS': 'eps',
            'SURA': 'eps',
            'EPS SURA': 'eps',
            'COMPENSAR': 'eps',
            'FAMISANAR': 'eps',
            'SALUD TOTAL': 'eps',
            'NUEVA EMPRESA PROMOTORA DE SALUD S.A.': 'eps',
            'NUEVA EMPRESA PROMOTORA DE SALUD': 'eps',
            'NUEVA EPS': 'eps',
            'COOMEVA': 'eps',
            'MEDIMAS': 'eps',
            'COOSALUD': 'eps',
            'CONTRIBUTIVO': 'eps',
            'SUBSIDIADO': 'eps',
            
            // PARTICULAR
            'PARTICULAR': 'particular',
            'PRIVADO': 'particular',
            'SIN ASEGURADOR': 'particular',
            'NO ASEGURADOR': 'particular',
            
            // SECRETARIAS DE SALUD
            'SECRETARIA DE SALUD DEPARTAMENTAL': 'secretaria_salud_departamental',
            'SECRETARIA DEPARTAMENTAL': 'secretaria_salud_departamental',
            'SALUD DEPARTAMENTAL': 'secretaria_salud_departamental',
            'SECRETARIA DE SALUD DISTRITAL': 'secretaria_salud_distrital',
            'SECRETARIA DISTRITAL': 'secretaria_salud_distrital',
            'SALUD DISTRITAL': 'secretaria_salud_distrital',
            
            // SOAT (Seguro Obligatorio de Accidentes de Tránsito)
            'SOAT': 'soat',
            'SEGURO OBLIGATORIO': 'soat',
            'ACCIDENTES DE TRANSITO': 'soat',
            'ACCIDENTES DE TRÁNSITO': 'soat'
        };
        
        const aseguradorUpper = aseguradorIA?.toUpperCase().trim();
        const mapped = mappings[aseguradorUpper];
        console.log(`Mapeando asegurador: "${aseguradorIA}" -> "${mapped}"`);
        return mapped || aseguradorIA?.toLowerCase() || ''; // Si no hay mapeo, usar el valor directo en minúsculas
    };

    // Función para inferir departamento basado en ciudad conocida
    const inferirDepartamentoPorCiudad = (ciudad: string): string => {
        const ciudadDepartamento: Record<string, string> = {
            'medellin': 'antioquia',
            'bello': 'antioquia', 
            'itagui': 'antioquia',
            'envigado': 'antioquia',
            'bogota': 'bogota',
            'cali': 'valle',
            'palmira': 'valle',
            'buenaventura': 'valle',
            'soacha': 'cundinamarca',
            'facatativa': 'cundinamarca',
            'zipaquira': 'cundinamarca'
        };
        
        return ciudadDepartamento[ciudad] || '';
    };

    // Filtrado de códigos CIE-10 con búsqueda OPTIMIZADO y DEBOUNCED
    const createCIE10Filter = (debouncedSearch: string) => {
        return useMemo(() => {
            // Si no hay búsqueda, mostrar solo los primeros 50 códigos más comunes
            if (!debouncedSearch) {
                return codigosCIE10.slice(0, 50);
            }
            
            // Si hay búsqueda, filtrar y limitar a 100 resultados máximo
            const searchLower = debouncedSearch.toLowerCase().trim();
            if (searchLower.length < 2) {
                // Si la búsqueda es muy corta, mostrar solo algunos resultados
                return codigosCIE10.slice(0, 20);
            }
            
            const filtered = codigosCIE10.filter(codigo => 
                codigo.label.toLowerCase().includes(searchLower) ||
                codigo.value.toLowerCase().includes(searchLower)
            );
            
            // Limitar a máximo 100 resultados para mantener fluidez
            return filtered.slice(0, 100);
        }, [debouncedSearch, codigosCIE10]);
    };

    const filteredCIE10 = createCIE10Filter(debouncedSearchCIE10);
    const filteredCIE10_1 = createCIE10Filter(debouncedSearchCIE10_1);
    const filteredCIE10_2 = createCIE10Filter(debouncedSearchCIE10_2);

    // Filtrado de instituciones con búsqueda OPTIMIZADO y DEBOUNCED
    const filteredInstituciones = useMemo(() => {
        // Si no hay búsqueda, mostrar solo las primeras 50 instituciones
        if (!debouncedSearchInstitucion) {
            return instituciones.slice(0, 50);
        }
        
        // Si hay búsqueda, filtrar y limitar a 100 resultados máximo
        const searchLower = debouncedSearchInstitucion.toLowerCase().trim();
        if (searchLower.length < 2) {
            // Si la búsqueda es muy corta, mostrar solo algunos resultados
            return instituciones.slice(0, 20);
        }
        
        const filtered = instituciones.filter(institucion => 
            institucion.label.toLowerCase().includes(searchLower) ||
            institucion.value.toLowerCase().includes(searchLower)
        );
        
        // Limitar a máximo 100 resultados para mantener fluidez
        return filtered.slice(0, 100);
    }, [debouncedSearchInstitucion, instituciones]);

    const { data, setData, post, processing, errors, reset } = useForm({
        // Paso 1: Información Personal
        tipo_identificacion: '',
        numero_identificacion: '',
        nombre: '',
        apellidos: '',
        fecha_nacimiento: '',
        edad: 0,
        sexo: '',
        historia_clinica: null as File | null,

        // Paso 2: Datos Sociodemográficos
        asegurador: '',
        asegurador_secundario: '', // Para EPS, ARL, SOAT específicos
        departamento: '',
        ciudad: '',
        institucion_remitente: '',

        // Paso 3: Datos Clínicos
        tipo_paciente: '',
        diagnostico_principal: '',
        diagnostico_1: '',
        diagnostico_2: '',
        fecha_ingreso: '',
        dias_hospitalizados: 0,
        motivo_consulta: '',
        enfermedad_actual: '',
        antecedentes: '',
        frecuencia_cardiaca: 0,
        frecuencia_respiratoria: 0,
        temperatura: 0,
        tension_sistolica: 0,
        tension_diastolica: 0,
        saturacion_oxigeno: 0,
        glucometria: 0,
        escala_glasgow: '',
        examen_fisico: '',
        plan_terapeutico: '',

        // Paso 3: Signos vitales - Requerimiento de oxígeno
        requerimiento_oxigeno: 'NO',
        medio_soporte_oxigeno: '',

        // Paso 4: Datos De Remisión
        motivo_remision: '',
        tipo_solicitud: '',
        especialidad_solicitada: [] as string[],
        tipo_servicio: '',
        tipo_apoyo: '',
    });

    // Debug: Loggar cuando cambia el paso para verificar persistencia de datos
    useEffect(() => {
        if (currentStep === 2) {
            console.log('🔍 Navegando al Paso 2 - Estado de datos sociodemográficos:', {
                asegurador: data.asegurador,
                departamento: data.departamento,
                ciudad: data.ciudad, 
                institucion_remitente: data.institucion_remitente,
                todoElFormulario: data
            });
        }
    }, [currentStep, data.asegurador, data.departamento, data.ciudad]);

    const steps = [
        { number: 1, title: 'Información Personal', active: true },
        { number: 2, title: 'Datos Sociodemográficos', active: false },
        { number: 3, title: 'Datos Clínicos', active: false },
        { number: 4, title: 'Datos De Remisión', active: false },
    ];

    const handleNext = () => {
        if (currentStep < 4) {
            // Validar el paso actual antes de avanzar
            let isValid = false;

            switch (currentStep) {
                case 1:
                    isValid = validateStep1();
                    // Debug: mostrar datos antes de navegar al paso 2
                    if (isValid) {
                        console.log('🔍 Datos antes de ir al paso 2:', {
                            asegurador: data.asegurador,
                            departamento: data.departamento,
                            ciudad: data.ciudad,
                            institucion_remitente: data.institucion_remitente
                        });
                    }
                    break;
                case 2:
                    isValid = validateStep2();
                    break;
                case 3:
                    isValid = validateStep3();
                    break;
                default:
                    isValid = true;
            }

            if (isValid) {
                setIsTransitioning(true);
                setTimeout(() => {
                    setCurrentStep(currentStep + 1);
                    setIsTransitioning(false);
                }, 150);
            }
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setIsTransitioning(true);
            // Limpiar errores al retroceder
            setValidationErrors([]);
            setTimeout(() => {
                setCurrentStep(currentStep - 1);
                setIsTransitioning(false);
            }, 150);
        }
    };

    const calculateAge = (birthDate: string) => {
        if (!birthDate) return 0;

        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age;
    };

    const handleDateChange = (date: string) => {
        setData('fecha_nacimiento', date);
        setData('edad', calculateAge(date));
    };

    const handleDepartamentoChange = (departamento: string) => {
        setData('departamento', departamento);
        setData('ciudad', ''); // Limpiar ciudad cuando cambia departamento
    };

    // Handler para cambios en el asegurador principal
    const handleAseguradorChange = (asegurador: string) => {
        setData('asegurador', asegurador);
        setData('asegurador_secundario', ''); // Limpiar selector secundario al cambiar principal
    };

    // Función para obtener las opciones del selector secundario según el asegurador principal
    const getSecondaryOptions = () => {
        switch (data.asegurador) {
            case 'eps':
                return epsOptions;
            case 'arl':
                return arlOptions;
            case 'soat':
                return soatOptions;
            default:
                return [];
        }
    };

    // Función para verificar si debe mostrar el selector secundario
    const shouldShowSecondarySelector = () => {
        return ['eps', 'arl', 'soat'].includes(data.asegurador);
    };

    // Función para mapear nombre específico de asegurador al valor del selector secundario
    const mapAseguradorSecundario = (nombreAsegurador: string, categoria: string): string => {
        const nombreUpper = nombreAsegurador?.toUpperCase().trim();
        
        // Función auxiliar para búsqueda flexible (contiene palabras clave)
        const contienePalabras = (texto: string, palabrasClave: string[]): boolean => {
            return palabrasClave.some(palabra => texto.includes(palabra));
        };
        
        let mapped = '';
        
        if (categoria === 'eps') {
            // Mapeo INTELIGENTE para EPS - búsqueda por palabras clave
            if (contienePalabras(nombreUpper, ['COOSALUD'])) {
                mapped = 'coosalud_eps';
            } else if (contienePalabras(nombreUpper, ['NUEVA EPS', 'NUEVA EMPRESA'])) {
                mapped = 'nueva_eps';
            } else if (contienePalabras(nombreUpper, ['SURA', 'SURAMERICANA']) && contienePalabras(nombreUpper, ['EPS'])) {
                mapped = 'eps_sura';
            } else if (contienePalabras(nombreUpper, ['SANITAS'])) {
                mapped = 'eps_sanitas';
            } else if (contienePalabras(nombreUpper, ['COMPENSAR'])) {
                mapped = 'compensar_eps';
            } else if (contienePalabras(nombreUpper, ['SALUD TOTAL'])) {
                mapped = 'salud_total_eps';
            } else if (contienePalabras(nombreUpper, ['FAMISANAR'])) {
                mapped = 'famisanar';
            } else if (contienePalabras(nombreUpper, ['ALIANSALUD'])) {
                mapped = 'aliansalud_eps';
            } else if (contienePalabras(nombreUpper, ['MUTUAL SER'])) {
                mapped = 'mutual_ser';
            } else if (contienePalabras(nombreUpper, ['CAPRESOCA'])) {
                mapped = 'capresoca';
            } else if (contienePalabras(nombreUpper, ['COMFENALCO'])) {
                mapped = 'comfenalco_valle';
            } else if (contienePalabras(nombreUpper, ['ASMET'])) {
                mapped = 'asmet_salud';
            } else if (contienePalabras(nombreUpper, ['EMSSANAR'])) {
                mapped = 'emssanar';
            } else if (contienePalabras(nombreUpper, ['SAVIA SALUD'])) {
                mapped = 'savia_salud';
            }
        } else if (categoria === 'arl') {
            // Mapeo INTELIGENTE para ARL
            if (contienePalabras(nombreUpper, ['POSITIVA'])) {
                mapped = 'arl_positiva';
            } else if (contienePalabras(nombreUpper, ['SURA', 'SURAMERICANA'])) {
                mapped = 'sura_suramericana';
            } else if (contienePalabras(nombreUpper, ['BOLIVAR', 'BOLÍVAR'])) {
                mapped = 'seguros_bolivar';
            } else if (contienePalabras(nombreUpper, ['COLMENA'])) {
                mapped = 'riesgos_laborales_colmena';
            } else if (contienePalabras(nombreUpper, ['AXA', 'COLPATRIA'])) {
                mapped = 'seguros_vida_colpatria';
            } else if (contienePalabras(nombreUpper, ['MAPFRE'])) {
                mapped = 'mapfre_colombia_vida';
            } else if (contienePalabras(nombreUpper, ['LIBERTY'])) {
                mapped = 'liberty_seguros';
            }
        } else if (categoria === 'soat') {
            // Mapeo INTELIGENTE para SOAT
            if (contienePalabras(nombreUpper, ['SURA', 'SURAMERICANA'])) {
                mapped = 'seguros_suramericana';
            } else if (contienePalabras(nombreUpper, ['SOLIDARIA'])) {
                mapped = 'aseguradora_solidaria';
            } else if (contienePalabras(nombreUpper, ['AXA', 'COLPATRIA'])) {
                mapped = 'axa_colpatria';
            } else if (contienePalabras(nombreUpper, ['HDI'])) {
                mapped = 'hdi_seguros';
            } else if (contienePalabras(nombreUpper, ['PREVISORA'])) {
                mapped = 'la_previsora';
            } else if (contienePalabras(nombreUpper, ['BOLIVAR', 'BOLÍVAR'])) {
                mapped = 'seguros_bolivar_soat';
            } else if (contienePalabras(nombreUpper, ['ESTADO'])) {
                mapped = 'seguros_estado';
            } else if (contienePalabras(nombreUpper, ['MUNDIAL'])) {
                mapped = 'seguros_mundial';
            }
        }
        
        console.log(`🔍 Mapeo inteligente: "${nombreAsegurador}" (${categoria}) -> "${mapped}"`);
        return mapped;
    };

    const getCiudadesDisponibles = () => {
        return ciudadesPorDepartamento[data.departamento] || [];
    };

    const calculateDiasHospitalizados = (fechaIngreso: string) => {
        if (!fechaIngreso) return 0;

        const today = new Date();
        const ingreso = new Date(fechaIngreso);
        const diffTime = Math.abs(today.getTime() - ingreso.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    };

    // 🔥 FUNCIÓN MEJORADA: Extracción AGRESIVA de fecha de ingreso 
    const extractFechaIngresoFromText = (text: string): string | null => {
        try {
            console.log('🔍 FALLBACK MEJORADO: Búsqueda AGRESIVA de fechas de ingreso...');
            console.log('🔍 FALLBACK: Longitud del texto:', text.length);
            console.log('🔍 FALLBACK: Fecha actual para comparación:', new Date().toISOString().split('T')[0]);
            
            // 🎯 ENFOQUE AGRESIVO: Múltiples patrones de búsqueda
            const contextualDates: Array<{
                original: string, 
                formatted: string, 
                date: Date, 
                context: string,
                priority: number
            }> = [];

            // Función helper para agregar fecha si no existe
            const addFechaIfNew = (fechaRaw: string, context: string, priority: number) => {
                const fechaFormateada = formatearFecha(fechaRaw);
                if (fechaFormateada && !contextualDates.find(d => d.original === fechaRaw)) {
                    contextualDates.push({
                        original: fechaRaw,
                        formatted: fechaFormateada,
                        date: new Date(fechaFormateada),
                        context,
                        priority
                    });
                    console.log(`🎯 P${priority}: ${context}: ${fechaRaw}`);
                    return true;
                }
                return false;
            };

            // 🏆 PRIORIDAD 1: Patrones específicos de ingreso
            const patterns1 = [
                /DATOS\s+DEL\s+INGRESO[\s\S]*?Fecha\s*:\s*(\d{1,2}\/\d{1,2}\/\d{4})/gi,
                /Nº\s+Ingreso[\s\S]*?Fecha\s*:\s*(\d{1,2}\/\d{1,2}\/\d{4})/gi,
                /N°\s+Ingreso[\s\S]*?Fecha\s*:\s*(\d{1,2}\/\d{1,2}\/\d{4})/gi,
                /Número\s+Ingreso[\s\S]*?Fecha\s*:\s*(\d{1,2}\/\d{1,2}\/\d{4})/gi,
                /INGRESO[\s\S]*?Fecha\s*:\s*(\d{1,2}\/\d{1,2}\/\d{4})/gi
            ];

            patterns1.forEach((pattern, i) => {
                let match;
                while ((match = pattern.exec(text)) !== null) {
                    addFechaIfNew(match[1].trim(), `Patrón Ingreso ${i+1}`, 1);
                }
            });

            // 🥈 PRIORIDAD 2: Fechas explícitas de ingreso
            const patterns2 = [
                /fecha\s*de\s*ingreso[\s\S]*?(\d{1,2}\/\d{1,2}\/\d{4})/gi,
                /fecha\s*ingreso[\s\S]*?(\d{1,2}\/\d{1,2}\/\d{4})/gi,
                /f\.\s*ingreso[\s\S]*?(\d{1,2}\/\d{1,2}\/\d{4})/gi,
                /ingresa[\s\S]*?(\d{1,2}\/\d{1,2}\/\d{4})/gi,
                /hospitalización[\s\S]*?(\d{1,2}\/\d{1,2}\/\d{4})/gi,
                /hospitalizacion[\s\S]*?(\d{1,2}\/\d{1,2}\/\d{4})/gi
            ];

            patterns2.forEach((pattern, i) => {
                let match;
                while ((match = pattern.exec(text)) !== null) {
                    addFechaIfNew(match[1].trim(), `Fecha Ingreso Explícita ${i+1}`, 2);
                }
            });

            // 🥉 PRIORIDAD 3: Fechas en contexto médico
            const patterns3 = [
                /admitido[\s\S]*?(\d{1,2}\/\d{1,2}\/\d{4})/gi,
                /admisión[\s\S]*?(\d{1,2}\/\d{1,2}\/\d{4})/gi,
                /admision[\s\S]*?(\d{1,2}\/\d{1,2}\/\d{4})/gi,
                /consulta[\s\S]*?(\d{1,2}\/\d{1,2}\/\d{4})/gi,
                /atención[\s\S]*?(\d{1,2}\/\d{1,2}\/\d{4})/gi,
                /atencion[\s\S]*?(\d{1,2}\/\d{1,2}\/\d{4})/gi
            ];

            patterns3.forEach((pattern, i) => {
                let match;
                while ((match = pattern.exec(text)) !== null) {
                    addFechaIfNew(match[1].trim(), `Contexto Médico ${i+1}`, 3);
                }
            });

            // 🔄 PRIORIDAD 4: Fechas cerca de palabras clave (búsqueda más amplia)
            const patterns4 = [
                /emergencia[\s\S]*?(\d{1,2}\/\d{1,2}\/\d{4})/gi,
                /urgencia[\s\S]*?(\d{1,2}\/\d{1,2}\/\d{4})/gi,
                /paciente[\s\S]*?(\d{1,2}\/\d{1,2}\/\d{4})/gi,
                /servicio[\s\S]*?(\d{1,2}\/\d{1,2}\/\d{4})/gi
            ];

            patterns4.forEach((pattern, i) => {
                let match;
                while ((match = pattern.exec(text)) !== null) {
                    addFechaIfNew(match[1].trim(), `Palabra Clave ${i+1}`, 4);
                }
            });

            // 🔥 PRIORIDAD 5: Patrones MUY FLEXIBLES (palabras clave cercanas)
            const flexiblePatterns = [
                /\b(\d{1,2}\/\d{1,2}\/\d{4})\b[\s\S]{0,50}(?:ingreso|admis|hospital|emergencia|urgencia)/gi,
                /(?:ingreso|admis|hospital|emergencia|urgencia)[\s\S]{0,50}\b(\d{1,2}\/\d{1,2}\/\d{4})\b/gi,
                /\b(\d{1,2}\/\d{1,2}\/\d{4})\b[\s\S]{0,100}(?:servicio|UCI|sala|piso)/gi,
                /(?:servicio|UCI|sala|piso)[\s\S]{0,100}\b(\d{1,2}\/\d{1,2}\/\d{4})\b/gi
            ];

            flexiblePatterns.forEach((pattern, i) => {
                let match;
                while ((match = pattern.exec(text)) !== null) {
                    addFechaIfNew(match[1].trim(), `Patrón Flexible ${i+1}`, 5);
                }
            });

            // 🎯 PRIORIDAD 6: SUPER AGRESIVO - Todas las fechas válidas de últimos 60 días
            console.log('🔥 BÚSQUEDA SUPER AGRESIVA: Todas las fechas de últimos 60 días...');
            const allDatesPattern = /\b(\d{1,2}\/\d{1,2}\/\d{4})\b/g;
            let match;
            while ((match = allDatesPattern.exec(text)) !== null) {
                const fechaRaw = match[1].trim();
                
                // ❌ EXCLUIR fechas que están claramente en contexto de impresión
                const contextBefore = text.substring(Math.max(0, match.index - 100), match.index);
                const contextAfter = text.substring(match.index, Math.min(text.length, match.index + 100));
                const fullContext = contextBefore + fechaRaw + contextAfter;
                
                const excludePatterns = [
                    /\(.*fecha.*\)/gi,
                    /impres[ióo]n/gi,
                    /documento/gi,
                    /generado/gi,
                    /sistema/gi
                ];
                
                const shouldExclude = excludePatterns.some(pattern => pattern.test(fullContext));
                
                if (!shouldExclude) {
                    const fechaFormateada = formatearFecha(fechaRaw);
                    if (fechaFormateada) {
                        const fechaObj = new Date(fechaFormateada);
                        const now = new Date();
                        const diffDays = (now.getTime() - fechaObj.getTime()) / (1000 * 60 * 60 * 24);
                        
                        // Ampliado a 60 días atrás y 14 días hacia adelante
                        if (diffDays >= -14 && diffDays <= 60 && !contextualDates.find(d => d.original === fechaRaw)) {
                            contextualDates.push({
                                original: fechaRaw,
                                formatted: fechaFormateada,
                                date: fechaObj,
                                context: `Fecha válida (${Math.round(diffDays)} días)`,
                                priority: 6
                            });
                            console.log(`🎯 P6: Fecha válida: ${fechaRaw} (${Math.round(diffDays)} días)`);
                        }
                    }
                }
            }

            // 🚨 PRIORIDAD 7: ÚLTIMO RECURSO - Cualquier fecha razonable
            if (contextualDates.length === 0) {
                console.log('🚨 ÚLTIMO RECURSO: Buscando CUALQUIER fecha razonable...');
                const desperatePattern = /\b(\d{1,2}\/\d{1,2}\/\d{4})\b/g;
                while ((match = desperatePattern.exec(text)) !== null) {
                    const fechaRaw = match[1].trim();
                    const fechaFormateada = formatearFecha(fechaRaw);
                    if (fechaFormateada) {
                        const fechaObj = new Date(fechaFormateada);
                        const now = new Date();
                        const diffDays = (now.getTime() - fechaObj.getTime()) / (1000 * 60 * 60 * 24);
                        
                        // Aún más flexible: 6 meses atrás
                        if (diffDays >= -30 && diffDays <= 180) {
                            contextualDates.push({
                                original: fechaRaw,
                                formatted: fechaFormateada,
                                date: fechaObj,
                                context: `Último recurso (${Math.round(diffDays)} días)`,
                                priority: 7
                            });
                            console.log(`🚨 P7: Último recurso: ${fechaRaw} (${Math.round(diffDays)} días)`);
                        }
                    }
                }
            }

            console.log(`📊 TOTAL FECHAS ENCONTRADAS: ${contextualDates.length}`);
            
            if (contextualDates.length === 0) {
                console.log('❌ FALLBACK: No se encontraron fechas en contexto de ingreso');
                return null;
            }
            
            // Ordenar por prioridad (menor número = mayor prioridad) y luego por recencia
            contextualDates.sort((a, b) => {
                if (a.priority !== b.priority) return a.priority - b.priority;
                return b.date.getTime() - a.date.getTime();
            });
            
            console.log('📊 FALLBACK: Fechas encontradas CON CONTEXTO (ordenadas por prioridad):');
            contextualDates.forEach((dateInfo, index) => {
                const diasDiferencia = Math.ceil((new Date().getTime() - dateInfo.date.getTime()) / (1000 * 60 * 60 * 24));
                console.log(`   ${index + 1}. ${dateInfo.original} - Contexto: "${dateInfo.context}" (hace ${diasDiferencia} días)`);
            });
            
            // Tomar la fecha con mayor prioridad de contexto
            const fechaSeleccionada = contextualDates[0];
            const diasDiferencia = Math.ceil((new Date().getTime() - fechaSeleccionada.date.getTime()) / (1000 * 60 * 60 * 24));
            
            console.log(`✅ FALLBACK: Fecha SELECCIONADA por contexto: ${fechaSeleccionada.original}`);
            console.log(`✅ FALLBACK: Contexto: "${fechaSeleccionada.context}"`);
            console.log(`✅ FALLBACK: Hace ${diasDiferencia} días`);
            console.log(`✅ FALLBACK: Fecha formateada final: ${fechaSeleccionada.formatted}`);
            
            return fechaSeleccionada.formatted;
        } catch (error) {
            console.error('❌ FALLBACK: Error extrayendo fecha:', error);
            return null;
        }
    };

    // Función auxiliar para formatear fecha DD/MM/YYYY a YYYY-MM-DD
    const formatearFecha = (fecha: string): string | null => {
        try {
            // Formato DD/MM/YYYY
            if (fecha.includes('/')) {
                const parts = fecha.split('/');
                if (parts.length === 3) {
                    const day = parts[0].padStart(2, '0');
                    const month = parts[1].padStart(2, '0');
                    const year = parts[2];
                    
                    // Validar que sea una fecha válida
                    const fechaObj = new Date(`${year}-${month}-${day}`);
                    if (!isNaN(fechaObj.getTime())) {
                        return `${year}-${month}-${day}`;
                    }
                }
            }
            return null;
        } catch (error) {
            console.error('Error formateando fecha:', error);
            return null;
        }
    };

    const handleFechaIngresoChange = (fecha: string) => {
        setData('fecha_ingreso', fecha);
        setData('dias_hospitalizados', calculateDiasHospitalizados(fecha));
    };

    // Validaciones por paso
    const validateStep1 = () => {
        const requiredFields = [
            'tipo_identificacion',
            'numero_identificacion',
            'nombre',
            'apellidos',
            'fecha_nacimiento',
            'sexo'
        ];

        const missingFields = requiredFields.filter(field => !data[field as keyof typeof data]);

        if (missingFields.length > 0) {
            setValidationErrors(missingFields);

            const fieldNames: Record<string, string> = {
                tipo_identificacion: 'Tipo de identificación',
                numero_identificacion: 'Número de identificación',
                nombre: 'Nombre',
                apellidos: 'Apellidos',
                fecha_nacimiento: 'Fecha de nacimiento',
                sexo: 'Sexo'
            };

            const missingFieldNames = missingFields.map(field => fieldNames[field]);

            toast.error("Campos obligatorios faltantes", {
                description: `Por favor complete: ${missingFieldNames.join(', ')}`,
                duration: 5000,
            });
            return false;
        }

        setValidationErrors([]);
        return true;
    };

    // Función para analizar archivo con IA
    const analyzeFileWithAI = async (file: File) => {
        setIsAnalyzingWithAI(true);
        setAiAnalysisResult(null);

        try {
            const formData = new FormData();
            formData.append('historia_clinica', file);

            // Usar la ruta correcta según el rol del usuario
            const aiRoute = userRole === 'ips' ? 'ips.ai.extraer-datos-documento' : 'medico.ai.extraer-datos-documento';
            const response = await axios.post(route(aiRoute), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const result = response.data;

            if (result.success) {
                setAiAnalysisResult(result);

                // Llenar automáticamente los campos con los datos extraídos
                const extractedData = result.data;

                console.log('🤖 RESPUESTA COMPLETA DE IA:', response.data);
                console.log('📊 Datos extraídos por IA:', extractedData);
                
                // 🔍 DEBUG: Mostrar TODOS los campos extraídos para diagnóstico
                console.log('🔍 TODOS LOS CAMPOS DISPONIBLES EN extractedData:');
                Object.keys(extractedData).forEach(key => {
                    console.log(`   ${key}:`, extractedData[key]);
                });
                
                // 🔍 DEBUG: Mostrar específicamente campos sociodemográficos
                console.log('🔍 CAMPOS SOCIODEMOGRÁFICOS EXTRAÍDOS POR IA:');
                console.log('   📍 Asegurador (categoría):', extractedData.asegurador || 'NO_ENCONTRADO');
                console.log('   🏢 Asegurador (nombre específico):', extractedData.asegurador_nombre || 'NO_ENCONTRADO');
                console.log('   🏦 Departamento:', extractedData.departamento || 'NO_ENCONTRADO');
                console.log('   🏦️ Ciudad:', extractedData.ciudad || 'NO_ENCONTRADO');
                console.log('   🏥 Institución Remitente:', extractedData.institucion_remitente || 'NO_ENCONTRADO');

                if (extractedData.tipo_identificacion) {
                    const mappedTipo = mapTipoIdentificacion(extractedData.tipo_identificacion);
                    setData('tipo_identificacion', mappedTipo);
                    console.log('Tipo identificación llenado:', extractedData.tipo_identificacion, '-> mapeado a:', mappedTipo);
                }
                if (extractedData.numero_identificacion) {
                    setData('numero_identificacion', extractedData.numero_identificacion);
                    console.log('Número identificación llenado:', extractedData.numero_identificacion);
                }
                if (extractedData.nombre) {
                    setData('nombre', extractedData.nombre);
                    console.log('Nombre llenado:', extractedData.nombre);
                }
                if (extractedData.apellidos) {
                    setData('apellidos', extractedData.apellidos);
                    console.log('Apellidos llenado:', extractedData.apellidos);
                }
                // Manejar fecha de nacimiento y edad
                if (extractedData.fecha_nacimiento) {
                    // Usar handleDateChange para que también calcule la edad
                    handleDateChange(extractedData.fecha_nacimiento);
                    console.log('Fecha nacimiento llenada:', extractedData.fecha_nacimiento);

                    // Si también hay edad de la IA, usarla en lugar de la calculada
                    if (extractedData.edad) {
                        setData('edad', extractedData.edad);
                        console.log('Edad de IA usada:', extractedData.edad);
                        
                        // 🎯 ASIGNAR TIPO DE PACIENTE AUTOMÁTICAMENTE
                        const tipoPacienteAuto = determinarTipoPaciente(extractedData.edad, extractedData.sexo);
                        setData('tipo_paciente', tipoPacienteAuto);
                        console.log(`🎯 Tipo de paciente asignado: ${tipoPacienteAuto} (edad: ${extractedData.edad}, sexo: ${extractedData.sexo})`);
                    } else {
                        console.log('Edad calculada desde fecha');
                        
                        // 🎯 ASIGNAR TIPO DE PACIENTE CON EDAD CALCULADA
                        const edadCalculada = calculateAge(extractedData.fecha_nacimiento);
                        if (edadCalculada !== null) {
                            const tipoPacienteAuto = determinarTipoPaciente(edadCalculada, extractedData.sexo);
                            setData('tipo_paciente', tipoPacienteAuto);
                            console.log(`🎯 Tipo de paciente asignado: ${tipoPacienteAuto} (edad calculada: ${edadCalculada}, sexo: ${extractedData.sexo})`);
                        }
                    }
                } else if (extractedData.edad) {
                    // Si no hay fecha pero sí edad, llenar la edad
                    setData('edad', extractedData.edad);
                    console.log('Edad llenada desde IA:', extractedData.edad);
                    console.log('Fecha de nacimiento no disponible - usuario deberá ingresarla manualmente');
                    
                    // 🎯 ASIGNAR TIPO DE PACIENTE SOLO CON EDAD
                    const tipoPacienteAuto = determinarTipoPaciente(extractedData.edad, extractedData.sexo);
                    setData('tipo_paciente', tipoPacienteAuto);
                    console.log(`🎯 Tipo de paciente asignado: ${tipoPacienteAuto} (solo edad: ${extractedData.edad}, sexo: ${extractedData.sexo})`);
                } else {
                    console.log('No se encontró fecha_nacimiento ni edad en los datos extraídos');
                }

                if (extractedData.sexo) {
                    setData('sexo', extractedData.sexo);
                    console.log('Sexo llenado:', extractedData.sexo);
                }

                // Procesar datos geográficos (departamento y ciudad)
                let departamentoMapeado = '';
                let ciudadMapeada = '';

                if (extractedData.departamento) {
                    departamentoMapeado = mapDepartamento(extractedData.departamento);
                    if (departamentoMapeado) {
                        setData('departamento', departamentoMapeado);
                        console.log('Departamento llenado:', extractedData.departamento, '-> mapeado a:', departamentoMapeado);
                    }
                }

                if (extractedData.ciudad) {
                    ciudadMapeada = mapCiudad(extractedData.ciudad, departamentoMapeado);
                    if (ciudadMapeada) {
                        setData('ciudad', ciudadMapeada);
                        console.log('Ciudad llenada:', extractedData.ciudad, '-> mapeada a:', ciudadMapeada);
                        
                        // Si no se pudo mapear el departamento pero sí la ciudad, intentar inferir el departamento
                        if (!departamentoMapeado) {
                            const departamentoInferido = inferirDepartamentoPorCiudad(ciudadMapeada);
                            if (departamentoInferido) {
                                setData('departamento', departamentoInferido);
                                console.log('Departamento inferido desde ciudad:', ciudadMapeada, '-> departamento:', departamentoInferido);
                            }
                        }
                    }
                }

                // Procesar asegurador con mapeo automático
                if (extractedData.asegurador) {
                    const aseguradorMapeado = mapAsegurador(extractedData.asegurador);
                    if (aseguradorMapeado) {
                        setData('asegurador', aseguradorMapeado);
                        console.log('Asegurador principal llenado:', extractedData.asegurador, '-> mapeado a:', aseguradorMapeado);
                        
                        // Mapear y llenar asegurador secundario automáticamente
                        if (extractedData.asegurador_nombre && ['eps', 'arl', 'soat'].includes(aseguradorMapeado)) {
                            const aseguradorSecundarioMapeado = mapAseguradorSecundario(extractedData.asegurador_nombre, aseguradorMapeado);
                            if (aseguradorSecundarioMapeado) {
                                setData('asegurador_secundario', aseguradorSecundarioMapeado);
                                console.log('🎯 Asegurador secundario llenado automáticamente:', extractedData.asegurador_nombre, '-> mapeado a:', aseguradorSecundarioMapeado);
                            } else {
                                console.log('⚠️ Asegurador secundario extraído pero no se pudo mapear:', extractedData.asegurador_nombre, 'para categoría:', aseguradorMapeado);
                            }
                        }
                    } else {
                        console.log('Asegurador extraído pero no se pudo mapear:', extractedData.asegurador);
                    }
                }

                // Buscar y mapear institución remitente desde la lista
                if (extractedData.institucion_remitente) {
                    const institucionBuscada = extractedData.institucion_remitente.toLowerCase().trim();
                    
                    // Buscar en la lista de instituciones cargadas
                    const institucionEncontrada = instituciones.find(inst => {
                        const labelLower = inst.label.toLowerCase();
                        const nombreLower = labelLower.split(' - ')[1] || labelLower; // Obtener solo el nombre sin código
                        
                        // Búsqueda por coincidencia parcial o exacta
                        return nombreLower.includes(institucionBuscada) || 
                               institucionBuscada.includes(nombreLower) ||
                               inst.value.toLowerCase().includes(institucionBuscada);
                    });
                    
                    if (institucionEncontrada) {
                        setData('institucion_remitente', institucionEncontrada.value);
                        console.log('✅ Institución remitente encontrada y mapeada:', extractedData.institucion_remitente, '-> mapeada a:', institucionEncontrada.value, '-', institucionEncontrada.label);
                    } else {
                        // Si no se encuentra en la lista, guardar el texto extraído por la IA
                        // El usuario puede modificarlo manualmente si es necesario
                        setData('institucion_remitente', extractedData.institucion_remitente);
                        console.log('⚠️ Institución remitente extraida por IA no encontrada en la lista:', extractedData.institucion_remitente);
                        console.log('✅ Guardado el texto extraído. El usuario puede modificarlo manualmente si es necesario.');
                    }
                }

                // 🔥 NUEVOS CAMPOS CLÍNICOS - SECCIÓN 3 "DATOS CLÍNICOS"
                console.log('🔍 CAMPOS CLÍNICOS EXTRAÍDOS POR IA:');
                
                // Fecha de ingreso y cálculo automático de días hospitalizados
                // 🔍 Buscar fecha_ingreso con múltiples variaciones de nombres
                let fechaIngreso = extractedData.fecha_ingreso || 
                                   extractedData.fechaIngreso || 
                                   extractedData.fecha_de_ingreso ||
                                   extractedData.fechaDeIngreso ||
                                   extractedData.ingreso_fecha ||
                                   null;
                
                // 🔥 FALLBACK FRONTEND: Si no encuentra fecha_ingreso, extraerla del texto
                if (!fechaIngreso && result.extracted_text_preview) {
                    console.log('   🔍 FALLBACK FRONTEND: Intentando extraer fecha_ingreso del texto...');
                    fechaIngreso = extractFechaIngresoFromText(result.extracted_text_preview);
                    if (fechaIngreso) {
                        console.log('   ✅ FALLBACK FRONTEND: Fecha extraída del texto:', fechaIngreso);
                    }
                }
                
                if (fechaIngreso) {
                    setData('fecha_ingreso', fechaIngreso);
                    // Usar la función existente que también calcula días hospitalizados
                    handleFechaIngresoChange(fechaIngreso);
                    console.log('   📅 Fecha de ingreso llenada:', fechaIngreso);
                    console.log('   🏥 Días hospitalizados calculados automáticamente');
                } else {
                    console.log('   📅 Fecha de ingreso: NO_ENCONTRADA en ninguna variación');
                    console.log('   🔍 Campos buscados: fecha_ingreso, fechaIngreso, fecha_de_ingreso, fechaDeIngreso, ingreso_fecha');
                    // Si no hay fecha de ingreso, asegurar que dias_hospitalizados sea 0
                    setData('dias_hospitalizados', 0);
                }

                // 🚫 DIAGNÓSTICOS (CIE-10) NO SE LLENAN AUTOMÁTICAMENTE - Responsabilidad del médico
                if (extractedData.diagnostico_principal) {
                    console.log('   🩺 Diagnóstico principal extraído por IA (NO LLENADO):', extractedData.diagnostico_principal);
                    console.log('   ⚠️ El diagnóstico principal debe ser verificado y llenado manualmente por el médico');
                }
                if (extractedData.diagnostico_1) {
                    console.log('   🩺 Diagnóstico No. 1 extraído por IA (NO LLENADO):', extractedData.diagnostico_1);
                    console.log('   ⚠️ El diagnóstico No. 1 debe ser verificado y llenado manualmente por el médico');
                }
                if (extractedData.diagnostico_2) {
                    console.log('   🩺 Diagnóstico No. 2 extraído por IA (NO LLENADO):', extractedData.diagnostico_2);
                    console.log('   ⚠️ El diagnóstico No. 2 debe ser verificado y llenado manualmente por el médico');
                }

                // Información clínica
                if (extractedData.motivo_consulta) {
                    setData('motivo_consulta', extractedData.motivo_consulta);
                    console.log('   💬 Motivo consulta llenado:', extractedData.motivo_consulta);
                }
                if (extractedData.enfermedad_actual) {
                    setData('enfermedad_actual', extractedData.enfermedad_actual);
                    console.log('   📝 Enfermedad actual llenada:', extractedData.enfermedad_actual);
                }
                // ANTECEDENTES: El médico debe revisarlo manualmente de la HC
                console.log('   ⚠️ Antecedentes NO se auto-llena (debe revisarse manualmente)');

                toast.success("Datos extraídos automáticamente");
            } else {
                throw new Error(result.message || 'Error desconocido');
            }
        } catch (error: any) {
            console.error('Error analizando archivo con IA:', error);

            let errorMessage = "No se pudieron extraer los datos del documento.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error("Error al analizar el archivo", {
                description: errorMessage,
                duration: 5000,
            });
        } finally {
            setIsAnalyzingWithAI(false);
        }
    };

    // Helper para verificar si un campo tiene error
    const hasFieldError = (fieldName: string) => {
        return validationErrors.includes(fieldName);
    };

    // Helper para obtener clases CSS de error
    const getFieldErrorClass = (fieldName: string) => {
        return hasFieldError(fieldName)
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-primary focus:ring-primary';
    };

    // Helper para limpiar error de un campo cuando se modifica
    const clearFieldError = (fieldName: string) => {
        if (hasFieldError(fieldName)) {
            setValidationErrors(prev => prev.filter(err => err !== fieldName));
        }
    };

    const validateStep2 = () => {
        const requiredFields = [
            'asegurador',
            'departamento',
            'ciudad',
            'institucion_remitente'
        ];

        // Si asegurador es 'eps', asegurador_secundario es obligatorio
        if (data.asegurador === 'eps' && !data.asegurador_secundario) {
            requiredFields.push('asegurador_secundario');
        }

        const missingFields = requiredFields.filter(field => !data[field as keyof typeof data]);

        if (missingFields.length > 0) {
            setValidationErrors(missingFields);

            const fieldNames: Record<string, string> = {
                asegurador: 'Tipo de asegurador (EPS/ARL/SOAT)',
                asegurador_secundario: 'Nombre de la EPS',
                departamento: 'Departamento',
                ciudad: 'Ciudad',
                institucion_remitente: 'Institución remitente'
            };

            const missingFieldNames = missingFields.map(field => fieldNames[field]);

            toast.error("Campos obligatorios faltantes", {
                description: `Por favor complete: ${missingFieldNames.join(', ')}`,
                duration: 5000,
            });
            return false;
        }

        setValidationErrors([]);
        return true;
    };

    const validateStep3 = () => {
        const requiredFields = [
            'tipo_paciente',
            'diagnostico_principal',
            'fecha_ingreso',
            'dias_hospitalizados',
            'motivo_consulta',
            'enfermedad_actual',
            'antecedentes',
            'frecuencia_cardiaca',
            'frecuencia_respiratoria',
            'temperatura',
            'tension_sistolica',
            'tension_diastolica',
            'saturacion_oxigeno',
            'escala_glasgow',
            'examen_fisico',
            'requerimiento_oxigeno'
        ];

        // Si requerimiento_oxigeno es SI, medio_soporte_oxigeno es requerido
        if (data.requerimiento_oxigeno === 'SI' && !data.medio_soporte_oxigeno) {
            requiredFields.push('medio_soporte_oxigeno');
        }

        const missingFields = requiredFields.filter(field => {
            if (field === 'medio_soporte_oxigeno') {
                return data.requerimiento_oxigeno === 'SI' && !data.medio_soporte_oxigeno;
            }
            // Para dias_hospitalizados, permitir 0 como válido (solo rechazar null/undefined)
            if (field === 'dias_hospitalizados') {
                return data.dias_hospitalizados === null || data.dias_hospitalizados === undefined;
            }
            return !data[field as keyof typeof data];
        });

        if (missingFields.length > 0) {
            setValidationErrors(missingFields);

            const fieldNames: Record<string, string> = {
                tipo_paciente: 'Tipo de paciente',
                diagnostico_principal: 'Diagnóstico principal',
                fecha_ingreso: 'Fecha de ingreso',
                dias_hospitalizados: 'Días hospitalizados',
                motivo_consulta: 'Motivo consulta',
                enfermedad_actual: 'Enfermedad actual',
                antecedentes: 'Antecedentes',
                frecuencia_cardiaca: 'Frecuencia Cardíaca',
                frecuencia_respiratoria: 'Frecuencia Respiratoria',
                temperatura: 'Temperatura',
                tension_sistolica: 'Tensión Arterial Sistólica',
                tension_diastolica: 'Tensión Arterial Diastólica',
                saturacion_oxigeno: 'Saturación de Oxígeno',
                escala_glasgow: 'Escala de Glasgow',
                examen_fisico: 'Examen físico',
                requerimiento_oxigeno: 'Requerimiento de oxígeno',
                medio_soporte_oxigeno: 'Medio de soporte de oxígeno'
            };

            const missingFieldNames = missingFields.map(field => fieldNames[field]);

            toast.error("Campos obligatorios faltantes", {
                description: `Por favor complete: ${missingFieldNames.join(', ')}`,
                duration: 5000,
            });
            return false;
        }

        setValidationErrors([]);
        return true;
    };

    const validateStep4 = () => {
        const requiredFields = [
            'motivo_remision',
            'tipo_solicitud',
            'especialidad_solicitada',
            'tipo_servicio'
        ];

        const missingFields = requiredFields.filter(field => {
            const value = data[field as keyof typeof data];
            // Para especialidad_solicitada (array), verificar si está vacío
            if (field === 'especialidad_solicitada') {
                return !Array.isArray(value) || value.length === 0;
            }
            // Para otros campos (string), verificar si están vacíos
            return !value;
        });

        if (missingFields.length > 0) {
            setValidationErrors(missingFields);

            const fieldNames: Record<string, string> = {
                motivo_remision: 'Motivo de remisión',
                tipo_solicitud: 'Tipo solicitud',
                especialidad_solicitada: 'Especialidad solicitada',
                tipo_servicio: 'Tipo de servicio'
            };

            const missingFieldNames = missingFields.map(field => fieldNames[field]);

            toast.error("Campos obligatorios faltantes", {
                description: `Por favor complete: ${missingFieldNames.join(', ')}`,
                duration: 5000,
            });
            return false;
        }

        setValidationErrors([]);
        return true;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ingresar Registro - HERMES" />

            <div className="flex h-full flex-1 flex-col gap-3 p-3 sm:gap-4 sm:p-4 md:gap-4 md:p-5">
                <div className="max-w-7xl mx-auto w-full px-2 sm:px-0">
                    {/* Header compacto con información inline */}
                    <Card className="bg-gradient-to-br from-primary via-primary to-primary/95 text-primary-foreground mb-3 sm:mb-4 border-0 shadow-[0_2px_4px_rgba(0,0,0,0.1),0_8px_16px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2)]">
                        <CardContent className="p-3 sm:p-4">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <Edit className="h-5 w-5 flex-shrink-0" />
                                    <h2 className="text-base sm:text-lg font-semibold">Ingreso de datos</h2>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-primary-foreground/70">Fecha:</p>
                                    <p className="text-sm sm:text-base font-medium">
                                        {new Date().toLocaleDateString('es-ES', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Layout principal con stepper y contenido */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4">
                        {/* Stepper compacto - Columna izquierda */}
                        <div className="lg:col-span-1">
                            <div className="lg:sticky lg:top-20 bg-gradient-to-b from-white to-slate-50/30 rounded-lg p-3 sm:p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)] relative before:absolute before:inset-0 before:rounded-lg before:pointer-events-none">
                                <div className="space-y-0.5 relative z-10">
                                    {steps.map((step, index) => (
                                        <div key={step.number} className="relative">
                                            <div className="flex items-center group">
                                                {/* Círculo compacto del paso */}
                                                <div className={`
                                                    flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-semibold
                                                    transition-all duration-500 ease-in-out transform
                                                    ${step.number === currentStep
                                                        ? 'bg-gradient-to-b from-primary to-primary/90 scale-105 shadow-[0_2px_4px_rgba(0,0,0,0.1),0_6px_12px_rgba(59,130,246,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] ring-2 ring-primary/20'
                                                        : step.number < currentStep
                                                            ? 'bg-gradient-to-b from-green-500 to-green-600 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_3px_8px_rgba(34,197,94,0.3)]'
                                                            : 'bg-gradient-to-b from-gray-300 to-gray-400 shadow-[0_1px_2px_rgba(0,0,0,0.1)]'
                                                    }
                                                `}>
                                                    <span className={`
                                                        transition-all duration-300
                                                        ${step.number === currentStep ? 'font-bold' : 'font-semibold'}
                                                    `}>
                                                        {step.number}
                                                    </span>
                                                </div>

                                                {/* Texto compacto del paso */}
                                                <div className="ml-2.5 flex-1 overflow-hidden">
                                                    <p className={`
                                                        font-medium text-xs transition-all duration-300 ease-in-out
                                                        ${step.number === currentStep
                                                            ? 'text-primary font-semibold'
                                                            : step.number < currentStep
                                                                ? 'text-green-600'
                                                                : 'text-gray-600'
                                                        }
                                                    `}>
                                                        {step.title}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Línea conectora compacta */}
                                            {index < steps.length - 1 && (
                                                <div className="ml-4 w-px h-6 relative">
                                                    {/* Línea base */}
                                                    <div className="absolute inset-0 bg-gray-300 transition-colors duration-300"></div>

                                                    {/* Línea de progreso animada */}
                                                    {step.number < currentStep && (
                                                        <div className="absolute inset-0 bg-green-500 transform origin-top animate-in slide-in-from-top duration-700"></div>
                                                    )}

                                                    {/* Línea activa */}
                                                    {step.number === currentStep && (
                                                        <div className="absolute inset-0 bg-primary/50"></div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Indicador de progreso compacto */}
                                <div className="mt-4 p-2.5 bg-gradient-to-b from-slate-50 to-slate-100/50 rounded-lg border-0 shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)]">
                                    <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                                        <span className="font-medium">Progreso</span>
                                        <span className="font-semibold text-primary">{Math.round((currentStep / steps.length) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
                                        <div
                                            className="bg-gradient-to-r from-primary via-primary to-primary/80 h-2 rounded-full transition-all duration-700 ease-out shadow-[0_1px_2px_rgba(59,130,246,0.3),inset_0_1px_0_rgba(255,255,255,0.4)]"
                                            style={{ width: `${(currentStep / steps.length) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contenido principal - Columna derecha */}
                        <div className="lg:col-span-3">

                            {/* Contenido del paso actual con animación */}
                            <div className={`
                                transition-all duration-300 ease-in-out
                                ${isTransitioning ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}
                            `}>
                                {currentStep === 1 && (
                        <Card className="bg-gradient-to-b from-white to-slate-50/20 border-0 shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_20px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,1)] rounded-lg relative before:absolute before:inset-0 before:rounded-lg before:pointer-events-none">
                            <CardHeader className="border-b border-slate-100 pb-2.5 relative z-10 p-3 sm:p-4">
                                <CardTitle className="text-base sm:text-lg text-slate-900">Información Personal</CardTitle>
                                <CardDescription className="text-xs sm:text-sm mt-1">
                                    <strong>Importante:</strong> Complete los datos tal como aparecen en el documento de identidad. Los campos con (*) son obligatorios.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 p-3 sm:p-4">
                                {/* Cargar historia clínica compacto */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="historia-clinica-upload" className="text-xs sm:text-sm font-medium">
                                        Cargar historia clínica con nota de ingreso
                                    </Label>
                                    <div className="bg-gradient-to-b from-slate-50 to-slate-100/50 border-2 border-dashed border-slate-200 rounded-lg p-3 text-center hover:from-slate-100 hover:to-slate-50 hover:border-slate-300 hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] transition-all duration-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] touch-manipulation">
                                        <Upload className="h-5 w-5 mx-auto mb-1.5 text-slate-400" />
                                        <p className="text-xs sm:text-sm text-slate-600 mb-2">
                                            Haga clic para cargar documentos o arrastre archivos aquí
                                        </p>
                                        <input
                                            type="file"
                                            id="historia-clinica-upload"
                                            className="hidden"
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setData('historia_clinica', file);
                                                    // Analizar automáticamente con IA
                                                    analyzeFileWithAI(file);
                                                }
                                            }}
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            type="button"
                                            onClick={() => document.getElementById('historia-clinica-upload')?.click()}
                                            disabled={isAnalyzingWithAI}
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            {isAnalyzingWithAI ? 'Analizando con IA...' : 'Seleccionar archivo'}
                                        </Button>

                                        {data.historia_clinica && !isAnalyzingWithAI && !aiAnalysisResult && (
                                            <div className="mt-2">
                                                <p className="text-sm text-blue-600">
                                                    📄 Archivo seleccionado: {data.historia_clinica.name}
                                                </p>
                                                <p className="text-xs text-blue-500 mt-1">
                                                    🤖 Analizando automáticamente con IA...
                                                </p>
                                            </div>
                                        )}

                                        {isAnalyzingWithAI && (
                                            <div className="mt-2 p-3 bg-gradient-to-b from-blue-50 to-blue-100/30 border-0 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05),0_2px_6px_rgba(59,130,246,0.15),inset_0_1px_0_rgba(255,255,255,0.6)]">
                                                <div className="flex items-center gap-2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                                    <span className="text-sm font-medium text-blue-800">Analizando documento con IA...</span>
                                                </div>
                                                <p className="text-xs text-blue-600 mt-1">
                                                    Extrayendo texto y analizando datos del paciente. Esto puede tomar unos segundos.
                                                </p>
                                            </div>
                                        )}

                                        {aiAnalysisResult && (
                                            <div className="mt-3 p-3 bg-gradient-to-b from-green-50 to-green-100/30 border-0 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05),0_2px_6px_rgba(34,197,94,0.15),inset_0_1px_0_rgba(255,255,255,0.6)]">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-green-600">✅</span>
                                                    <span className="text-sm font-medium text-green-800">Datos extraídos automáticamente</span>
                                                </div>
                                                <p className="text-xs text-green-600 mb-2">
                                                    Los campos se han llenado con la información del documento. Revisa los datos y haz clic en "Siguiente".
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Formulario de datos personales - 3 columnas en desktop */}
                                <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="tipo_identificacion" className={hasFieldError('tipo_identificacion') ? 'text-red-600' : ''}>
                                            Tipo de identificación *
                                        </Label>
                                        <Select value={data.tipo_identificacion} onValueChange={(value) => setData('tipo_identificacion', value)}>
                                            <SelectTrigger id="tipo_identificacion" className={hasFieldError('tipo_identificacion') ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Seleccione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cc">Cédula de Ciudadanía</SelectItem>
                                                <SelectItem value="ti">Tarjeta de Identidad</SelectItem>
                                                <SelectItem value="ce">Cédula de Extranjería</SelectItem>
                                                <SelectItem value="pp">Pasaporte</SelectItem>
                                                <SelectItem value="rc">Registro Civil</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {hasFieldError('tipo_identificacion') && (
                                            <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="numero_identificacion" className={(hasFieldError('numero_identificacion') || errors.numero_identificacion) ? 'text-red-600' : ''}>
                                            Número de identificación *
                                        </Label>
                                        <Input
                                            id="numero_identificacion"
                                            value={data.numero_identificacion}
                                            onChange={(e) => {
                                                clearFieldError('numero_identificacion');
                                                setData('numero_identificacion', e.target.value);
                                            }}
                                            placeholder="Ingrese el número sin puntos ni comas"
                                            className={getFieldErrorClass('numero_identificacion') || (errors.numero_identificacion ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '')}
                                        />
                                        {(hasFieldError('numero_identificacion') || errors.numero_identificacion) && (
                                            <p className="text-sm text-red-600">{errors.numero_identificacion || 'Este campo es obligatorio'}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="nombre" className={hasFieldError('nombre') ? 'text-red-600' : ''}>
                                            Nombre *
                                        </Label>
                                        <Input
                                            id="nombre"
                                            value={data.nombre}
                                            onChange={(e) => setData('nombre', e.target.value)}
                                            placeholder="Nombres completos"
                                            className={getFieldErrorClass('nombre')}
                                        />
                                        {hasFieldError('nombre') && (
                                            <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="apellidos" className={hasFieldError('apellidos') ? 'text-red-600' : ''}>
                                            Apellidos *
                                        </Label>
                                        <Input
                                            id="apellidos"
                                            value={data.apellidos}
                                            onChange={(e) => setData('apellidos', e.target.value)}
                                            placeholder="Apellidos completos"
                                            className={getFieldErrorClass('apellidos')}
                                        />
                                        {hasFieldError('apellidos') && (
                                            <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="fecha_nacimiento" className={hasFieldError('fecha_nacimiento') ? 'text-red-600' : ''}>
                                            Fecha de nacimiento *
                                        </Label>
                                        <Input
                                            id="fecha_nacimiento"
                                            type="date"
                                            value={data.fecha_nacimiento}
                                            onChange={(e) => handleDateChange(e.target.value)}
                                            placeholder="yyyy-mm-dd"
                                            className={getFieldErrorClass('fecha_nacimiento')}
                                        />
                                        {hasFieldError('fecha_nacimiento') && (
                                            <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="edad">Edad *</Label>
                                        <Input
                                            id="edad"
                                            value={data.edad}
                                            readOnly
                                            placeholder="0"
                                            className="bg-gray-50"
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="sexo" className={hasFieldError('sexo') ? 'text-red-600' : ''}>
                                            Sexo *
                                        </Label>
                                        <Select value={data.sexo} onValueChange={(value) => setData('sexo', value)}>
                                            <SelectTrigger id="sexo" className={hasFieldError('sexo') ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Seleccione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="masculino">Masculino</SelectItem>
                                                <SelectItem value="femenino">Femenino</SelectItem>
                                                <SelectItem value="otro">Otro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {hasFieldError('sexo') && (
                                            <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                        )}
                                    </div>
                                </div>

                                {/* Botón siguiente */}
                                <div className="flex justify-end pt-6">
                                    <Button
                                        onClick={handleNext}
                                        className="px-8"
                                        disabled={isTransitioning}
                                    >
                                        {isTransitioning ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Cargando...
                                            </>
                                        ) : (
                                            <>
                                                Siguiente
                                                <ChevronRight className="h-4 w-4 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                            </Card>
                                )}

                                {/* Paso 2: Datos Sociodemográficos */}
                                {currentStep === 2 && (
                                    <Card className="bg-gradient-to-b from-white to-slate-50/20 border-0 shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_20px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,1)] rounded-lg">
                                        <CardHeader className="border-b border-slate-100 pb-2.5 p-3 sm:p-4">
                                            <CardTitle className="text-base sm:text-lg text-slate-900">Datos Sociodemográficos</CardTitle>
                                            <CardDescription className="text-xs sm:text-sm mt-1">
                                                Los campos con (*) son obligatorios
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4 p-3 sm:p-4">
                                            <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
                                                {/* Asegurador */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="asegurador" className={hasFieldError('asegurador') ? 'text-red-600' : ''}>Asegurador *</Label>
                                                    <Select value={data.asegurador} onValueChange={(value) => {
                                                        clearFieldError('asegurador');
                                                        handleAseguradorChange(value);
                                                    }}>
                                                        <SelectTrigger id="asegurador" className={hasFieldError('asegurador') ? 'border-red-500' : ''}>
                                                            <SelectValue placeholder="Seleccione" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {aseguradores.map((asegurador) => (
                                                                <SelectItem key={asegurador.value} value={asegurador.value}>
                                                                    {asegurador.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {hasFieldError('asegurador') && (
                                                        <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                                    )}
                                                </div>

                                                {/* Selector Secundario Condicional - EPS, ARL, SOAT */}
                                                {shouldShowSecondarySelector() && (
                                                    <div className="space-y-2">
                                                        <Label htmlFor="asegurador_secundario">
                                                            {data.asegurador === 'eps' && 'Entidad Promotora de Salud *'}
                                                            {data.asegurador === 'arl' && 'Administradora de Riesgos Laborales *'}
                                                            {data.asegurador === 'soat' && 'Aseguradora SOAT *'}
                                                        </Label>
                                                        <Select 
                                                            value={data.asegurador_secundario} 
                                                            onValueChange={(value) => setData('asegurador_secundario', value)}
                                                        >
                                                            <SelectTrigger id="asegurador_secundario">
                                                                <SelectValue placeholder="Seleccione" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {getSecondaryOptions().map((option) => (
                                                                    <SelectItem key={option.value} value={option.value}>
                                                                        {option.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                )}

                                                {/* Departamento */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="departamento" className={hasFieldError('departamento') ? 'text-red-600' : ''}>Departamento *</Label>
                                                    <Select value={data.departamento} onValueChange={(value) => {
                                                        clearFieldError('departamento');
                                                        handleDepartamentoChange(value);
                                                    }}>
                                                        <SelectTrigger id="departamento" className={hasFieldError('departamento') ? 'border-red-500' : ''}>
                                                            <SelectValue placeholder="Seleccione" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {departamentos.map((departamento) => (
                                                                <SelectItem key={departamento.value} value={departamento.value}>
                                                                    {departamento.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {hasFieldError('departamento') && (
                                                        <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                                    )}
                                                </div>

                                                {/* Ciudad */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="ciudad" className={hasFieldError('ciudad') ? 'text-red-600' : ''}>Ciudad *</Label>
                                                    <Select
                                                        value={data.ciudad}
                                                        onValueChange={(value) => {
                                                            clearFieldError('ciudad');
                                                            setData('ciudad', value);
                                                        }}
                                                        disabled={!data.departamento}
                                                    >
                                                        <SelectTrigger id="ciudad" className={hasFieldError('ciudad') ? 'border-red-500' : ''}>
                                                            <SelectValue placeholder={data.departamento ? "Seleccione" : "Primero seleccione un departamento"} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {getCiudadesDisponibles().map((ciudad) => (
                                                                <SelectItem key={ciudad.value} value={ciudad.value}>
                                                                    {ciudad.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {hasFieldError('ciudad') && (
                                                        <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                                    )}
                                                </div>

                                                {/* Institución remitente */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="institucion_remitente" className={hasFieldError('institucion_remitente') ? 'text-red-600' : ''}>Institución remitente *</Label>
                                                    <div className="relative" data-institucion-dropdown>
                                                        {/* Campo unificado: búsqueda + selección */}
                                                        <div className="space-y-2">
                                                            <Input
                                                                id="institucion_remitente"
                                                                type="text"
                                                                placeholder={loadingInstituciones ? "Cargando instituciones..." : "Busque y seleccione una institución..."}
                                                                value={searchInstitucion}
                                                                onChange={(e) => {
                                                                    setSearchInstitucion(e.target.value);
                                                                    if (data.institucion_remitente) {
                                                                        clearFieldError('institucion_remitente');
                                                                    }
                                                                }}
                                                                disabled={loadingInstituciones}
                                                                className={`pr-10 ${hasFieldError('institucion_remitente') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                                            />
                                                            
                                                            {/* Dropdown de resultados (solo si hay búsqueda) */}
                                                            {(searchInstitucion.length >= 2 || loadingInstituciones) && (
                                                                <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
                                                                    {loadingInstituciones ? (
                                                                        <div className="p-3 flex items-center text-sm text-gray-500">
                                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                                                            Cargando instituciones...
                                                                        </div>
                                                                    ) : debouncedSearchInstitucion && filteredInstituciones.length > 0 ? (
                                                                        <>
                                                                            {filteredInstituciones.map((institucion) => (
                                                                                <div
                                                                                    key={institucion.value}
                                                                                    className="px-3 py-2 cursor-pointer hover:bg-blue-50 text-sm border-b border-gray-100 last:border-b-0"
                                                                                    onClick={() => {
                                                                                        setData('institucion_remitente', institucion.value);
                                                                                        setSearchInstitucion('');
                                                                                        clearFieldError('institucion_remitente');
                                                                                    }}
                                                                                >
                                                                                    {institucion.label}
                                                                                </div>
                                                                            ))}
                                                                            {filteredInstituciones.length === 100 && (
                                                                                <div className="px-3 py-2 text-xs text-amber-600 bg-amber-50 border-t">
                                                                                    ⚠️ Hay más resultados. Refine su búsqueda.
                                                                                </div>
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <div className="px-3 py-2 text-sm text-gray-500">
                                                                            No se encontraron instituciones que coincidan
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        {/* Mostrar institución seleccionada */}
                                                        {data.institucion_remitente && (
                                                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md flex items-start justify-between gap-2">
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-medium text-green-800">
                                                                        Institución seleccionada: {data.institucion_remitente}
                                                                    </p>
                                                                    <p className="text-xs text-green-600">
                                                                        {instituciones.find(i => i.value === data.institucion_remitente)?.label}
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setData('institucion_remitente', '');
                                                                        clearFieldError('institucion_remitente');
                                                                    }}
                                                                    className="text-green-600 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                                                                    title="Eliminar institución"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        )}
                                                        {hasFieldError('institucion_remitente') && (
                                                            <p className="text-sm text-red-600 mt-1">Este campo es obligatorio</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Botones de navegación */}
                                            <div className="flex justify-between pt-6">
                                                <Button
                                                    variant="outline"
                                                    onClick={handlePrevious}
                                                    disabled={isTransitioning}
                                                >
                                                    Anterior
                                                </Button>
                                                <Button
                                                    onClick={handleNext}
                                                    disabled={isTransitioning}
                                                >
                                                    {isTransitioning ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                            Cargando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Siguiente
                                                            <ChevronRight className="h-4 w-4 ml-2" />
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Paso 3: Datos Clínicos */}
                                {currentStep === 3 && (
                                    <Card className="bg-gradient-to-b from-white to-slate-50/20 border-0 shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_20px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,1)] rounded-lg">
                                        <CardHeader className="border-b border-slate-100 pb-2.5 p-3 sm:p-4">
                                            <CardTitle className="text-base sm:text-lg text-slate-900">Datos Clínicos</CardTitle>
                                            <CardDescription className="text-xs sm:text-sm mt-1">
                                                Los campos con (*) son obligatorios
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4 p-3 sm:p-4">
                                            {/* Primera sección: Información básica */}
                                            <div className="grid gap-6 md:grid-cols-2">
                                                {/* Tipo de paciente */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="tipo_paciente" className={hasFieldError('tipo_paciente') ? 'text-red-600' : ''}>Tipo de paciente *</Label>
                                                    <Select value={data.tipo_paciente} onValueChange={(value) => {
                                                        clearFieldError('tipo_paciente');
                                                        setData('tipo_paciente', value);
                                                    }}>
                                                        <SelectTrigger id="tipo_paciente" className={hasFieldError('tipo_paciente') ? 'border-red-500' : ''}>
                                                            <SelectValue placeholder="Seleccione" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {tiposPaciente.map((tipo) => (
                                                                <SelectItem key={tipo.value} value={tipo.value}>
                                                                    {tipo.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {hasFieldError('tipo_paciente') && (
                                                        <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                                    )}
                                                </div>

                                                {/* Fecha de ingreso */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="fecha_ingreso" className={hasFieldError('fecha_ingreso') ? 'text-red-600' : ''}>Fecha de ingreso *</Label>
                                                    <Input
                                                        id="fecha_ingreso"
                                                        type="date"
                                                        value={data.fecha_ingreso}
                                                        onChange={(e) => {
                                                            clearFieldError('fecha_ingreso');
                                                            handleFechaIngresoChange(e.target.value);
                                                        }}
                                                        placeholder="yyyy-mm-dd"
                                                        className={getFieldErrorClass('fecha_ingreso')}
                                                    />
                                                    {hasFieldError('fecha_ingreso') && (
                                                        <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                                    )}
                                                </div>

                                                {/* Días hospitalizados */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="dias_hospitalizados">Días hospitalizados</Label>
                                                    <Input
                                                        id="dias_hospitalizados"
                                                        value={data.dias_hospitalizados}
                                                        readOnly
                                                        placeholder="0"
                                                        className="bg-gray-50"
                                                    />
                                                </div>
                                            </div>

                                            {/* Segunda sección: Diagnósticos */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-medium">Diagnósticos</h3>
                                                <div className="grid gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="diagnostico_principal" className={hasFieldError('diagnostico_principal') ? 'text-red-600' : ''}>Diagnóstico principal (CIE-10) *</Label>
                                                        <div className="relative" data-cie10-dropdown>
                                                            {/* Campo unificado: búsqueda + selección */}
                                                            <div className="space-y-2">
                                                                <Input
                                                                    id="diagnostico_principal"
                                                                    type="text"
                                                                    placeholder={loadingCIE10 ? "Cargando códigos..." : "Busque y seleccione un código CIE-10..."}
                                                                    value={searchCIE10}
                                                                    onChange={(e) => {
                                                                        setSearchCIE10(e.target.value);
                                                                        if (data.diagnostico_principal) {
                                                                            clearFieldError('diagnostico_principal');
                                                                        }
                                                                    }}
                                                                    disabled={loadingCIE10}
                                                                    className={`pr-10 ${hasFieldError('diagnostico_principal') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                                                />
                                                                
                                                                {/* Dropdown de resultados (solo si hay búsqueda) */}
                                                                {(searchCIE10.length >= 2 || loadingCIE10) && (
                                                                    <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
                                                                        {loadingCIE10 ? (
                                                                            <div className="p-3 flex items-center text-sm text-gray-500">
                                                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                                                                Cargando códigos CIE-10...
                                                                            </div>
                                                                        ) : debouncedSearchCIE10 && filteredCIE10.length > 0 ? (
                                                                            <>
                                                                                {filteredCIE10.map((codigo) => (
                                                                                    <div
                                                                                        key={codigo.value}
                                                                                        className="px-3 py-2 cursor-pointer hover:bg-blue-50 text-sm border-b border-gray-100 last:border-b-0"
                                                                                        onClick={() => {
                                                                                            setData('diagnostico_principal', codigo.value);
                                                                                            setSearchCIE10('');
                                                                                            clearFieldError('diagnostico_principal');
                                                                                        }}
                                                                                    >
                                                                                        {codigo.label}
                                                                                    </div>
                                                                                ))}
                                                                                {filteredCIE10.length === 100 && (
                                                                                    <div className="px-3 py-2 text-xs text-amber-600 bg-amber-50 border-t">
                                                                                        ⚠️ Hay más resultados. Refine su búsqueda.
                                                                                    </div>
                                                                                )}
                                                                            </>
                                                                        ) : (
                                                                            <div className="px-3 py-2 text-sm text-gray-500">
                                                                                No se encontraron códigos que coincidan
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            
                                                            {/* Mostrar código seleccionado */}
                                                            {data.diagnostico_principal && (
                                                                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md flex items-start justify-between gap-2">
                                                                    <div className="flex-1">
                                                                        <p className="text-sm font-medium text-green-800">
                                                                            Código seleccionado: {data.diagnostico_principal}
                                                                        </p>
                                                                        <p className="text-xs text-green-600">
                                                                            {codigosCIE10.find(c => c.value === data.diagnostico_principal)?.label}
                                                                        </p>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setData('diagnostico_principal', '');
                                                                            clearFieldError('diagnostico_principal');
                                                                        }}
                                                                        className="text-green-600 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                                                                        title="Eliminar diagnóstico"
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                            {hasFieldError('diagnostico_principal') && (
                                                                <p className="text-sm text-red-600 mt-1">Este campo es obligatorio</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="grid gap-4 md:grid-cols-2">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="diagnostico_1">Diagnóstico No. 1</Label>
                                                            <div className="relative" data-cie10-dropdown>
                                                                <div className="space-y-2">
                                                                    <Input
                                                                        id="diagnostico_1"
                                                                        type="text"
                                                                        placeholder={loadingCIE10 ? "Cargando códigos..." : "Busque y seleccione un código CIE-10..."}
                                                                        value={searchCIE10_1}
                                                                        onChange={(e) => setSearchCIE10_1(e.target.value)}
                                                                        disabled={loadingCIE10}
                                                                        className="pr-10"
                                                                    />
                                                                    
                                                                    {/* Dropdown de resultados */}
                                                                    {(searchCIE10_1.length >= 2 || loadingCIE10) && (
                                                                        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
                                                                            {loadingCIE10 ? (
                                                                                <div className="p-3 flex items-center text-sm text-gray-500">
                                                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                                                                    Cargando códigos CIE-10...
                                                                                </div>
                                                                            ) : debouncedSearchCIE10_1 && filteredCIE10_1.length > 0 ? (
                                                                                <>
                                                                                    {filteredCIE10_1.map((codigo) => (
                                                                                        <div
                                                                                            key={codigo.value}
                                                                                            className="px-3 py-2 cursor-pointer hover:bg-blue-50 text-sm border-b border-gray-100 last:border-b-0"
                                                                                            onClick={() => {
                                                                                                setData('diagnostico_1', codigo.value);
                                                                                                setSearchCIE10_1('');
                                                                                            }}
                                                                                        >
                                                                                            {codigo.label}
                                                                                        </div>
                                                                                    ))}
                                                                                    {filteredCIE10_1.length === 100 && (
                                                                                        <div className="px-3 py-2 text-xs text-amber-600 bg-amber-50 border-t">
                                                                                            ⚠️ Hay más resultados. Refine su búsqueda.
                                                                                        </div>
                                                                                    )}
                                                                                </>
                                                                            ) : (
                                                                                <div className="px-3 py-2 text-sm text-gray-500">
                                                                                    No se encontraron códigos que coincidan
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                
                                                                {/* Mostrar código seleccionado */}
                                                                {data.diagnostico_1 && (
                                                                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md flex items-start justify-between gap-2">
                                                                        <div className="flex-1">
                                                                            <p className="text-sm font-medium text-green-800">
                                                                                Código seleccionado: {data.diagnostico_1}
                                                                            </p>
                                                                            <p className="text-xs text-green-600">
                                                                                {codigosCIE10.find(c => c.value === data.diagnostico_1)?.label}
                                                                            </p>
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setData('diagnostico_1', '')}
                                                                            className="text-green-600 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                                                                            title="Eliminar diagnóstico"
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="diagnostico_2">Diagnóstico No. 2</Label>
                                                            <div className="relative" data-cie10-dropdown>
                                                                <div className="space-y-2">
                                                                    <Input
                                                                        id="diagnostico_2"
                                                                        type="text"
                                                                        placeholder={loadingCIE10 ? "Cargando códigos..." : "Busque y seleccione un código CIE-10..."}
                                                                        value={searchCIE10_2}
                                                                        onChange={(e) => setSearchCIE10_2(e.target.value)}
                                                                        disabled={loadingCIE10}
                                                                        className="pr-10"
                                                                    />
                                                                    
                                                                    {/* Dropdown de resultados */}
                                                                    {(searchCIE10_2.length >= 2 || loadingCIE10) && (
                                                                        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
                                                                            {loadingCIE10 ? (
                                                                                <div className="p-3 flex items-center text-sm text-gray-500">
                                                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                                                                    Cargando códigos CIE-10...
                                                                                </div>
                                                                            ) : debouncedSearchCIE10_2 && filteredCIE10_2.length > 0 ? (
                                                                                <>
                                                                                    {filteredCIE10_2.map((codigo) => (
                                                                                        <div
                                                                                            key={codigo.value}
                                                                                            className="px-3 py-2 cursor-pointer hover:bg-blue-50 text-sm border-b border-gray-100 last:border-b-0"
                                                                                            onClick={() => {
                                                                                                setData('diagnostico_2', codigo.value);
                                                                                                setSearchCIE10_2('');
                                                                                            }}
                                                                                        >
                                                                                            {codigo.label}
                                                                                        </div>
                                                                                    ))}
                                                                                    {filteredCIE10_2.length === 100 && (
                                                                                        <div className="px-3 py-2 text-xs text-amber-600 bg-amber-50 border-t">
                                                                                            ⚠️ Hay más resultados. Refine su búsqueda.
                                                                                        </div>
                                                                                    )}
                                                                                </>
                                                                            ) : (
                                                                                <div className="px-3 py-2 text-sm text-gray-500">
                                                                                    No se encontraron códigos que coincidan
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                
                                                                {/* Mostrar código seleccionado */}
                                                                {data.diagnostico_2 && (
                                                                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md flex items-start justify-between gap-2">
                                                                        <div className="flex-1">
                                                                            <p className="text-sm font-medium text-green-800">
                                                                                Código seleccionado: {data.diagnostico_2}
                                                                            </p>
                                                                            <p className="text-xs text-green-600">
                                                                                {codigosCIE10.find(c => c.value === data.diagnostico_2)?.label}
                                                                            </p>
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setData('diagnostico_2', '')}
                                                                            className="text-green-600 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                                                                            title="Eliminar diagnóstico"
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tercera sección: Información clínica */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-medium">Información Clínica</h3>
                                                <div className="grid gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="motivo_consulta" className={hasFieldError('motivo_consulta') ? 'text-red-600' : ''}>Motivo consulta *</Label>
                                                        <textarea
                                                            id="motivo_consulta"
                                                            value={data.motivo_consulta}
                                                            onChange={(e) => {
                                                                clearFieldError('motivo_consulta');
                                                                setData('motivo_consulta', e.target.value);
                                                            }}
                                                            placeholder="Describa el motivo de la consulta"
                                                            className={`w-full min-h-[80px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 resize-vertical ${hasFieldError('motivo_consulta') ? 'border-red-500 focus:ring-red-500 focus:border-transparent' : 'border-gray-300 focus:ring-primary focus:border-transparent'}`}
                                                        />
                                                        {hasFieldError('motivo_consulta') && (
                                                            <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="enfermedad_actual" className={hasFieldError('enfermedad_actual') ? 'text-red-600' : ''}>Enfermedad actual *</Label>
                                                        <textarea
                                                            id="enfermedad_actual"
                                                            value={data.enfermedad_actual}
                                                            onChange={(e) => {
                                                                clearFieldError('enfermedad_actual');
                                                                setData('enfermedad_actual', e.target.value);
                                                            }}
                                                            placeholder="Describa la enfermedad actual del paciente"
                                                            className={`w-full min-h-[100px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 resize-vertical ${hasFieldError('enfermedad_actual') ? 'border-red-500 focus:ring-red-500 focus:border-transparent' : 'border-gray-300 focus:ring-primary focus:border-transparent'}`}
                                                        />
                                                        {hasFieldError('enfermedad_actual') && (
                                                            <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="antecedentes" className={hasFieldError('antecedentes') ? 'text-red-600' : ''}>Antecedentes *</Label>
                                                        <textarea
                                                            id="antecedentes"
                                                            value={data.antecedentes}
                                                            onChange={(e) => {
                                                                clearFieldError('antecedentes');
                                                                setData('antecedentes', e.target.value);
                                                            }}
                                                            placeholder="Antecedentes médicos, quirúrgicos, familiares, etc."
                                                            className={`w-full min-h-[100px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 resize-vertical ${hasFieldError('antecedentes') ? 'border-red-500 focus:ring-red-500 focus:border-transparent' : 'border-gray-300 focus:ring-primary focus:border-transparent'}`}
                                                        />
                                                        {hasFieldError('antecedentes') && (
                                                            <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Cuarta sección: Signos vitales */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-medium">Signos Vitales</h3>
                                                <div className="grid gap-4 md:grid-cols-3">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="frecuencia_cardiaca" className={hasFieldError('frecuencia_cardiaca') ? 'text-red-600' : ''}>Frecuencia Cardíaca (lpm) *</Label>
                                                        <Input
                                                            id="frecuencia_cardiaca"
                                                            type="number"
                                                            min="40"
                                                            max="300"
                                                            value={data.frecuencia_cardiaca}
                                                            onChange={(e) => {
                                                                clearFieldError('frecuencia_cardiaca');
                                                                setData('frecuencia_cardiaca', parseInt(e.target.value) || 0);
                                                            }}
                                                            placeholder="Normal: 60-100 lpm"
                                                            className={getFieldErrorClass('frecuencia_cardiaca')}
                                                        />
                                                        {hasFieldError('frecuencia_cardiaca') && (
                                                            <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                                        )}
                                                        <p className="text-xs text-muted-foreground">
                                                            Rango normal: 60-100 lpm | Bradicardia: &lt;60 | Taquicardia: &gt;100
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="frecuencia_respiratoria" className={hasFieldError('frecuencia_respiratoria') ? 'text-red-600' : ''}>Frecuencia Respiratoria (rpm) *</Label>
                                                        <Input
                                                            id="frecuencia_respiratoria"
                                                            type="number"
                                                            min="10"
                                                            max="80"
                                                            value={data.frecuencia_respiratoria}
                                                            onChange={(e) => {
                                                                clearFieldError('frecuencia_respiratoria');
                                                                setData('frecuencia_respiratoria', parseInt(e.target.value) || 0);
                                                            }}
                                                            placeholder="Normal: 12-20 rpm"
                                                            className={getFieldErrorClass('frecuencia_respiratoria')}
                                                        />
                                                        {hasFieldError('frecuencia_respiratoria') && (
                                                            <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                                        )}
                                                        <p className="text-xs text-muted-foreground">
                                                            Rango normal: 12-20 rpm | Bradipnea: &lt;12 | Taquipnea: &gt;20
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="temperatura" className={hasFieldError('temperatura') ? 'text-red-600' : ''}>Temperatura (°C) *</Label>
                                                        <Input
                                                            id="temperatura"
                                                            type="number"
                                                            step="0.1"
                                                            min="34"
                                                            max="42"
                                                            value={data.temperatura}
                                                            onChange={(e) => {
                                                                clearFieldError('temperatura');
                                                                setData('temperatura', parseFloat(e.target.value) || 0);
                                                            }}
                                                            placeholder="Normal: 36.1-37.2°C"
                                                            className={getFieldErrorClass('temperatura')}
                                                        />
                                                        {hasFieldError('temperatura') && (
                                                            <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                                        )}
                                                        <p className="text-xs text-muted-foreground">
                                                            Normal: 36.1-37.2°C | Hipotermia: &lt;36°C | Fiebre: &gt;37.5°C
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="tension_sistolica" className={hasFieldError('tension_sistolica') ? 'text-red-600' : ''}>Tensión Arterial Sistólica (mmHg) *</Label>
                                                        <Input
                                                            id="tension_sistolica"
                                                            type="number"
                                                            min="50"
                                                            max="300"
                                                            value={data.tension_sistolica}
                                                            onChange={(e) => {
                                                                clearFieldError('tension_sistolica');
                                                                setData('tension_sistolica', parseInt(e.target.value) || 0);
                                                            }}
                                                            placeholder="Normal: 90-120 mmHg"
                                                            className={getFieldErrorClass('tension_sistolica')}
                                                        />
                                                        {hasFieldError('tension_sistolica') && (
                                                            <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                                        )}
                                                        <p className="text-xs text-muted-foreground">
                                                            Normal: 90-120 mmHg | Hipotensión: &lt;90 | Hipertensión: &gt;140
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="tension_diastolica" className={hasFieldError('tension_diastolica') ? 'text-red-600' : ''}>Tensión Arterial Diastólica (mmHg) *</Label>
                                                        <Input
                                                            id="tension_diastolica"
                                                            type="number"
                                                            min="20"
                                                            max="200"
                                                            value={data.tension_diastolica}
                                                            onChange={(e) => {
                                                                clearFieldError('tension_diastolica');
                                                                setData('tension_diastolica', parseInt(e.target.value) || 0);
                                                            }}
                                                            placeholder="Normal: 60-80 mmHg"
                                                            className={getFieldErrorClass('tension_diastolica')}
                                                        />
                                                        {hasFieldError('tension_diastolica') && (
                                                            <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                                        )}
                                                        <p className="text-xs text-muted-foreground">
                                                            Normal: 60-80 mmHg | Hipotensión: &lt;60 | Hipertensión: &gt;90
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="saturacion_oxigeno" className={hasFieldError('saturacion_oxigeno') ? 'text-red-600' : ''}>Saturación de Oxígeno (%) *</Label>
                                                        <Input
                                                            id="saturacion_oxigeno"
                                                            type="number"
                                                            min="50"
                                                            max="100"
                                                            value={data.saturacion_oxigeno}
                                                            onChange={(e) => {
                                                                clearFieldError('saturacion_oxigeno');
                                                                setData('saturacion_oxigeno', parseInt(e.target.value) || 0);
                                                            }}
                                                            placeholder="Normal: 95-100%"
                                                            className={getFieldErrorClass('saturacion_oxigeno')}
                                                        />
                                                        {hasFieldError('saturacion_oxigeno') && (
                                                            <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                                        )}
                                                        <p className="text-xs text-muted-foreground">
                                                            Normal: 95-100% | Hipoxemia leve: 90-94% | Hipoxemia severa: &lt;90%
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="glucometria">Glucometría (mg/dL)</Label>
                                                        <Input
                                                            id="glucometria"
                                                            type="number"
                                                            min="0"
                                                            max="1000"
                                                            value={data.glucometria}
                                                            onChange={(e) => setData('glucometria', parseInt(e.target.value) || 0)}
                                                            placeholder="Normal: 70-110 mg/dL"
                                                        />
                                                        <p className="text-xs text-muted-foreground">
                                                            Normal: 70-110 mg/dL | Hipoglucemia: &lt;70 | Hiperglucemia: &gt;126 (ayunas)
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="escala_glasgow" className={hasFieldError('escala_glasgow') ? 'text-red-600' : ''}>Escala de Glasgow *</Label>
                                                        <Select value={data.escala_glasgow} onValueChange={(value) => {
                                                            clearFieldError('escala_glasgow');
                                                            setData('escala_glasgow', value);
                                                        }}>
                                                            <SelectTrigger className={hasFieldError('escala_glasgow') ? 'border-red-500' : ''}>
                                                                <SelectValue placeholder="Seleccione" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {escalasGlasgow.map((escala) => (
                                                                    <SelectItem key={escala.value} value={escala.value}>
                                                                        {escala.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        {hasFieldError('escala_glasgow') && (
                                                            <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="requerimiento_oxigeno" className={hasFieldError('requerimiento_oxigeno') ? 'text-red-600' : ''}>Requerimiento de oxígeno *</Label>
                                                        <Select value={data.requerimiento_oxigeno} onValueChange={(value) => {
                                                            clearFieldError('requerimiento_oxigeno');
                                                            setData('requerimiento_oxigeno', value);
                                                            if (value === 'NO') {
                                                                setData('medio_soporte_oxigeno', '');
                                                                clearFieldError('medio_soporte_oxigeno');
                                                            }
                                                        }}>
                                                            <SelectTrigger id="requerimiento_oxigeno" className={hasFieldError('requerimiento_oxigeno') ? 'border-red-500' : ''}>
                                                                <SelectValue placeholder="Seleccione" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="NO">NO</SelectItem>
                                                                <SelectItem value="SI">SÍ</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        {hasFieldError('requerimiento_oxigeno') && (
                                                            <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                                        )}
                                                    </div>

                                                    {data.requerimiento_oxigeno === 'SI' && (
                                                        <div className="space-y-2">
                                                            <Label htmlFor="medio_soporte_oxigeno" className={hasFieldError('medio_soporte_oxigeno') ? 'text-red-600' : ''}>Medio de soporte de oxígeno *</Label>
                                                            <Select value={data.medio_soporte_oxigeno} onValueChange={(value) => {
                                                                clearFieldError('medio_soporte_oxigeno');
                                                                setData('medio_soporte_oxigeno', value);
                                                            }}>
                                                                <SelectTrigger id="medio_soporte_oxigeno" className={hasFieldError('medio_soporte_oxigeno') ? 'border-red-500' : ''}>
                                                                    <SelectValue placeholder="Seleccione el medio de soporte" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Canula nasal">Canula nasal</SelectItem>
                                                                    <SelectItem value="Mascara simple">Mascara simple</SelectItem>
                                                                    <SelectItem value="Mascara de no reinhalacion">Mascara de no reinhalacion</SelectItem>
                                                                    <SelectItem value="Ventury (Alto flujo)">Ventury (Alto flujo)</SelectItem>
                                                                    <SelectItem value="Intubación Orotraqueal">Intubación Orotraqueal</SelectItem>
                                                                    <SelectItem value="Traqueostomía">Traqueostomía</SelectItem>
                                                                    <SelectItem value="Canula nasal de alto flujo">Canula nasal de alto flujo</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            {hasFieldError('medio_soporte_oxigeno') && (
                                                                <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Quinta sección: Examen físico */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-medium">Examen Físico</h3>
                                                <div className="grid gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="examen_fisico" className={hasFieldError('examen_fisico') ? 'text-red-600' : ''}>Examen físico *</Label>
                                                        <textarea
                                                            id="examen_fisico"
                                                            value={data.examen_fisico}
                                                            onChange={(e) => {
                                                                clearFieldError('examen_fisico');
                                                                setData('examen_fisico', e.target.value);
                                                            }}
                                                            placeholder="Describa los hallazgos del examen físico"
                                                            className={`w-full min-h-[120px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 resize-vertical ${hasFieldError('examen_fisico') ? 'border-red-500 focus:ring-red-500 focus:border-transparent' : 'border-gray-300 focus:ring-primary focus:border-transparent'}`}
                                                        />
                                                        {hasFieldError('examen_fisico') && (
                                                            <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="plan_terapeutico">Plan terapéutico</Label>
                                                        <textarea
                                                            id="plan_terapeutico"
                                                            value={data.plan_terapeutico}
                                                            onChange={(e) => setData('plan_terapeutico', e.target.value)}
                                                            placeholder="Describa el plan terapéutico a seguir"
                                                            className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Botones de navegación */}
                                            <div className="flex justify-between pt-6">
                                                <Button
                                                    variant="outline"
                                                    onClick={handlePrevious}
                                                    disabled={isTransitioning}
                                                >
                                                    Anterior
                                                </Button>
                                                <Button
                                                    onClick={handleNext}
                                                    disabled={isTransitioning}
                                                >
                                                    {isTransitioning ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                            Cargando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Siguiente
                                                            <ChevronRight className="h-4 w-4 ml-2" />
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Paso 4: Datos De Remisión */}
                                {currentStep === 4 && (
                                    <Card className="bg-gradient-to-b from-white to-slate-50/20 border-0 shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_20px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,1)] rounded-lg">
                                        <CardHeader className="border-b border-slate-100 pb-2.5 p-3 sm:p-4">
                                            <CardTitle className="text-base sm:text-lg text-slate-900">Datos De Remisión</CardTitle>
                                            <CardDescription className="text-xs sm:text-sm mt-1">
                                                Los campos con (*) son obligatorios
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4 p-3 sm:p-4">
                                            {/* Primera sección: Información de remisión */}
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="motivo_remision" className={hasFieldError('motivo_remision') ? 'text-red-600' : ''}>Motivo de remisión *</Label>
                                                    <textarea
                                                        id="motivo_remision"
                                                        value={data.motivo_remision}
                                                        onChange={(e) => {
                                                            clearFieldError('motivo_remision');
                                                            setData('motivo_remision', e.target.value);
                                                        }}
                                                        placeholder="Describa detalladamente el motivo por el cual se remite al paciente"
                                                        className={`w-full min-h-[120px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 resize-vertical ${hasFieldError('motivo_remision') ? 'border-red-500 focus:ring-red-500 focus:border-transparent' : 'border-gray-300 focus:ring-primary focus:border-transparent'}`}
                                                    />
                                                    {hasFieldError('motivo_remision') && (
                                                        <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Segunda sección: Tipo de solicitud y especialidad */}
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="tipo_solicitud" className={hasFieldError('tipo_solicitud') ? 'text-red-600' : ''}>Tipo solicitud *</Label>
                                                    <Select value={data.tipo_solicitud} onValueChange={(value) => {
                                                        clearFieldError('tipo_solicitud');
                                                        setData('tipo_solicitud', value);
                                                    }}>
                                                        <SelectTrigger className={hasFieldError('tipo_solicitud') ? 'border-red-500' : ''}>
                                                            <SelectValue placeholder="Seleccione" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {tiposSolicitud.map((tipo) => (
                                                                <SelectItem key={tipo.value} value={tipo.value}>
                                                                    {tipo.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {hasFieldError('tipo_solicitud') && (
                                                        <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="especialidad_solicitada" className={hasFieldError('especialidad_solicitada') ? 'text-red-600' : ''}>Especialidad solicitada * (Selección múltiple)</Label>
                                                    <div className="relative">
                                                        <Select>
                                                            <SelectTrigger className={hasFieldError('especialidad_solicitada') ? 'border-red-500' : ''}>
                                                                <SelectValue 
                                                                    placeholder={
                                                                        data.especialidad_solicitada.length === 0 
                                                                            ? "Seleccione una o más especialidades..." 
                                                                            : `${data.especialidad_solicitada.length} especialidad${data.especialidad_solicitada.length > 1 ? 'es' : ''} seleccionada${data.especialidad_solicitada.length > 1 ? 's' : ''}`
                                                                    }
                                                                />
                                                            </SelectTrigger>
                                                            <SelectContent className="max-h-80">
                                                                {/* Campo de búsqueda */}
                                                                <div className="px-2 pb-2 sticky top-0 bg-white border-b">
                                                                    <Input
                                                                        type="text"
                                                                        placeholder="Buscar especialidad..."
                                                                        value={searchEspecialidad}
                                                                        onChange={(e) => setSearchEspecialidad(e.target.value)}
                                                                        className="h-9 text-sm"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    />
                                                                </div>
                                                                
                                                                {/* Lista filtrada */}
                                                                <div className="max-h-60 overflow-y-auto">
                                                                    {especialidades
                                                                        .filter(especialidad => 
                                                                            especialidad.label.toLowerCase().includes(searchEspecialidad.toLowerCase())
                                                                        )
                                                                        .map((especialidad) => (
                                                                            <label
                                                                                key={especialidad.value}
                                                                                className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded"
                                                                            >
                                                                                <input
                                                                                    type="checkbox"
                                                                                    id={`especialidad_${especialidad.value}`}
                                                                                    checked={data.especialidad_solicitada.includes(especialidad.value)}
                                                                                    onChange={() => {
                                                                                        const currentValues = Array.isArray(data.especialidad_solicitada) 
                                                                                            ? data.especialidad_solicitada 
                                                                                            : [];
                                                                                        
                                                                                        if (currentValues.includes(especialidad.value)) {
                                                                                            // Remover si ya está seleccionado
                                                                                            const newValues = currentValues.filter(val => val !== especialidad.value);
                                                                                            setData('especialidad_solicitada', newValues);
                                                                                            if (newValues.length > 0) {
                                                                                                clearFieldError('especialidad_solicitada');
                                                                                            }
                                                                                        } else {
                                                                                            // Agregar si no está seleccionado
                                                                                            setData('especialidad_solicitada', 
                                                                                                [...currentValues, especialidad.value]
                                                                                            );
                                                                                            clearFieldError('especialidad_solicitada');
                                                                                        }
                                                                                    }}
                                                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                                                />
                                                                                <span className="text-sm">{especialidad.label}</span>
                                                                            </label>
                                                                        ))
                                                                    }
                                                                    {especialidades.filter(especialidad => 
                                                                        especialidad.label.toLowerCase().includes(searchEspecialidad.toLowerCase())
                                                                    ).length === 0 && (
                                                                        <div className="p-4 text-sm text-center text-gray-500">
                                                                            No se encontraron especialidades
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </SelectContent>
                                                        </Select>
                                                        
                                                        {/* Mostrar especialidades seleccionadas */}
                                                        {data.especialidad_solicitada.length > 0 && (
                                                            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                                                                <p className="text-sm font-medium text-blue-800 mb-1">
                                                                    Especialidades seleccionadas:
                                                                </p>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {data.especialidad_solicitada.map((value) => {
                                                                        const especialidad = especialidades.find(e => e.value === value);
                                                                        return (
                                                                            <span 
                                                                                key={value}
                                                                                className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                                                                            >
                                                                                {especialidad?.label}
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        const newValues = data.especialidad_solicitada.filter(val => val !== value);
                                                                                        setData('especialidad_solicitada', newValues);
                                                                                        if (newValues.length > 0) {
                                                                                            clearFieldError('especialidad_solicitada');
                                                                                        }
                                                                                    }}
                                                                                    className="ml-1 h-3 w-3 text-blue-600 hover:text-blue-800"
                                                                                >
                                                                                    ×
                                                                                </button>
                                                                            </span>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {hasFieldError('especialidad_solicitada') && (
                                                            <p className="text-sm text-red-600 mt-1">Este campo es obligatorio</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tercera sección: Tipos de servicio y apoyo */}
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="tipo_servicio" className={hasFieldError('tipo_servicio') ? 'text-red-600' : ''}>Tipo de servicio *</Label>
                                                    <Select value={data.tipo_servicio} onValueChange={(value) => {
                                                        clearFieldError('tipo_servicio');
                                                        setData('tipo_servicio', value);
                                                    }}>
                                                        <SelectTrigger id="tipo_servicio" className={hasFieldError('tipo_servicio') ? 'border-red-500' : ''}>
                                                            <SelectValue placeholder="Seleccione" />
                                                        </SelectTrigger>
                                                        <SelectContent side="bottom" sideOffset={4} avoidCollisions={false}>
                                                            {tiposServicio.map((servicio) => (
                                                                <SelectItem key={servicio.value} value={servicio.value}>
                                                                    {servicio.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {hasFieldError('tipo_servicio') && (
                                                        <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Cuarta sección: Tipo de apoyo */}
                                            <div className="space-y-2">
                                                <Label htmlFor="tipo_apoyo">Tipo de apoyo</Label>
                                                <Select value={data.tipo_apoyo} onValueChange={(value) => setData('tipo_apoyo', value)}>
                                                    <SelectTrigger id="tipo_apoyo">
                                                        <SelectValue placeholder="Seleccione" />
                                                    </SelectTrigger>
                                                    <SelectContent side="bottom" sideOffset={4} avoidCollisions={false}>
                                                        {tiposApoyo.map((apoyo) => (
                                                            <SelectItem key={apoyo.value} value={apoyo.value}>
                                                                {apoyo.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Botones de navegación */}
                                            <div className="flex justify-between pt-6">
                                                <Button
                                                    variant="outline"
                                                    onClick={handlePrevious}
                                                    disabled={isTransitioning || isSavingRecord}
                                                >
                                                    Anterior
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        // Validar paso 4 antes de finalizar
                                                        if (validateStep4()) {
                                                            console.log('Datos a enviar:', data);

                                                            // Preparar datos transformados
                                                            const transformedData = {
                                                                ...data,
                                                                // Convertir array de especialidades a string
                                                                especialidad_solicitada: Array.isArray(data.especialidad_solicitada) 
                                                                    ? data.especialidad_solicitada.join(', ') 
                                                                    : data.especialidad_solicitada,
                                                                // Asegurar que glucometria sea un número válido o null
                                                                glucometria: data.glucometria || null
                                                            };

                                                            // Usar la ruta correcta según el rol del usuario
                                                            const storeRoute = userRole === 'ips' ? 'ips.ingresar-registro.store' : 'medico.ingresar-registro.store';
                                                            
                                                            router.post(route(storeRoute), transformedData, {
                                                                onStart: () => {
                                                                    setIsSavingRecord(true);
                                                                    console.log('Iniciando envío y análisis con IA...');
                                                                    toast.info("Guardando registro", {
                                                                        description: "Analizando con IA y guardando datos del paciente...",
                                                                        duration: 3000,
                                                                    });
                                                                },
                                                                onSuccess: () => {
                                                                    toast.success("¡Registro médico guardado exitosamente!", {
                                                                        description: "El paciente ha sido registrado. Redirigiendo a consulta de pacientes...",
                                                                        duration: 3000,
                                                                    });
                                                                },
                                                                onError: (errors) => {
                                                                    console.error('Errores de validación:', errors);
                                                                    
                                                                    // Verificar si es el error de límite de registros por día
                                                                    if (errors.numero_identificacion && 
                                                                        errors.numero_identificacion.includes('más de dos veces en el día')) {
                                                                        toast.error("Límite de registros alcanzado", {
                                                                            description: errors.numero_identificacion,
                                                                            duration: 8000,
                                                                        });
                                                                    } else {
                                                                        toast.error("Error al guardar el registro", {
                                                                            description: "Por favor revise los datos e intente nuevamente.",
                                                                            duration: 5000,
                                                                        });
                                                                    }
                                                                },
                                                                onFinish: () => {
                                                                    setIsSavingRecord(false);
                                                                    console.log('Envío finalizado');
                                                                }
                                                            });
                                                        }
                                                    }}
                                                    disabled={isSavingRecord}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    {isSavingRecord ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                            Guardando y analizando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Finalizar Registro
                                                            <ChevronRight className="h-4 w-4 ml-2" />
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
