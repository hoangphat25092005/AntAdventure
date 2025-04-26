import { FeatureCollection, Feature, Polygon } from 'geojson';
import { Province } from '../data/provinceData';

export interface ProvinceFeature extends Feature<Polygon> {
  properties: {
    name: string;
    id: string;
    [key: string]: any;
  };
}

export interface ProvinceFeatureCollection extends FeatureCollection {
  features: ProvinceFeature[];
}

export interface ProvinceInfoProps {
  selectedProvince: Province | null;
}

export interface ProvinceListProps {
  provinces: Province[];
  onProvinceSelect: (provinceId: string) => void;
  selectedProvinceId: string | null;
}

export interface MapProps {
  onProvinceSelect: (provinceId: string) => void;
  selectedProvinceId: string | null;
}