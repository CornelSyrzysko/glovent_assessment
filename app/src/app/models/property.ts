export class Property {
  id?: number;
  deleted?: boolean;
  description?: string;
  image?: File;
  address?: string;
  unit_identifier?: string;
  property_type?: PropertyType;
  gps_lat?: number;
  gps_lang?: number;
  stand_size?: string;
  property_size?: string;

  constructor( deleted: boolean, description: string,
    image: File, address: string, unit_identifier: string,
    property_type: PropertyType, gps_lat: number, gps_lang: number,
    stand_size: string, property_size: string
  ){
    this.deleted = deleted;
    this.description = description;
    this.image = image;
    this.address = address;
    this.unit_identifier = unit_identifier;
    this.property_type = property_type;
    this.property_size = property_size;
    this.stand_size = stand_size;
    this.gps_lat = gps_lat;
    this.gps_lang = gps_lang;
  }
}

export type PropertyType = "Full Title" | "Section Title" |"Apartment"|"Office";
