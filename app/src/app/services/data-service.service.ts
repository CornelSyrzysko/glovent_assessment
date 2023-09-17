import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Property } from '../models/property';
import { environment } from 'src/environments/environment';
import { FileUpload } from 'primeng/fileupload';
import { Observable, finalize } from 'rxjs';
// import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient,
    // private storage: AngularFireStorage
    ) { }

  getProperties() {
    return this.http.get<Property[]>(`${environment.apiUrl}/properties`);
  }

  getPropertyById(propertyId: string) {
    return this.http.get<Property>(`${environment.apiUrl}/properties/${propertyId}`)
  }

  filterProperties(searchText: String) {
    return this.http.get<Property[]>(`${environment.apiUrl}/properties?q=${searchText}`);
  }

  updateProperty(propertyDetails: Property) {
    return this.http.put<any>(`${environment.apiUrl}/properties/${propertyDetails.id}`, {...propertyDetails});
  }

  addProperty(propertyDetails: Property) {
    return this.http.post<Property>(`${environment.apiUrl}/properties`, {...propertyDetails});
  }

  deleteProperty(property: Property) {
    // Normally a delete would be handled by the backend completely.
    // for this demo, I'm simply adding a deleted state to the item as a way to demonstrate a
    // 'soft delete' where the element won't be visible to the user, but still be present on
    // the database.
    return this.http.put<Property>(`${environment.apiUrl}/properties/${property.id}`, {...property})
  }

  uploadFileToFirebase(fileUpload: FileUpload) {
    // const filePath = `uploads/${fileUpload.files[0].name}`;
    // const storageRef = this.storage.ref(filePath);
    // const uploadTask = this.storage.upload(filePath, fileUpload.files[0]);
    // var imageUrl;
    // uploadTask.snapshotChanges().pipe(
    //   finalize(() => {
    //     storageRef.getDownloadURL().subscribe(downloadURL => {
    //       fileUpload.url = downloadURL;
    //       fileUpload.name = fileUpload.files[0].name;
    //       imageUrl = downloadURL;
    //       // this.saveFileData(fileUpload);
    //     });
    //   })
    // ).subscribe();

    // return imageUrl;
  }

}
