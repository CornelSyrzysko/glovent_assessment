export interface Property {
  id: number
  deleted: boolean,
  description: string
  image: string
  address: string
  unit_identifier: string
  property_type: PropertyType
  gps_lat: number
  gps_lang: number
  stand_size: string
  property_size: string
}

export type PropertyType = "Full Title" | "Section Title" |"Apartment"|"Office";
