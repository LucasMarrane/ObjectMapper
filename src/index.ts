import { MapperConfigType, MapperGenerator } from "./mapper/MapperGenerator";

const config: MapperConfigType<{nome: string}> = { 
    'Alaude.alo.descricao.chu': {callback: ()=> 'xablau1'}
}

MapperGenerator.createMapByConfig({nome: "xablau"},config)