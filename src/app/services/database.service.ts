import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { map } from 'rxjs/operators';
import { LabourType } from '../models/LabourType';
import { SourceType } from '../models/SourceType';
import { RecordType } from '../models/RecordType';
import { VehicleType } from '../models/VehicleType';
import { RemainderType } from '../models/RemainderType';
import { orderBy } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(
    private database: AngularFirestore
  ) { }

  savePersonalContent(userId: string, content: string) {
    return this.database.collection("users").doc(userId).collection("personalNotes").add({
      content: content,
      timeToDisplay: new Date().toDateString() + " " + new Date().toLocaleTimeString()
    });
  }

  getPersonalContent(userId: string) {
    return this.database.collection("users").doc(userId).collection("personalNotes", ref => ref.orderBy('timeToDisplay', "desc")).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  addNewLabour(userId: string, groupId: string, labour: LabourType) {
    console.log(userId, groupId, labour);
    return this.database.collection("users").doc(userId).collection("groups").doc(groupId).collection("labours").add({
      labourName: labour.labourName,
      payType: labour.payType,
      salary: labour.salary,
      advance: labour.advance
    });
  }

  getPeopleList(userId: string, groupId: string) {
    return this.database.collection("users").doc(userId).collection("groups").doc(groupId).collection("labours").snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as LabourType;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }  

  getLabourCount(userId: string, groupId: string) {
    return this.database.collection("users").doc(userId).collection("groups").doc(groupId).collection("labours").valueChanges();
  }

  checkAttendanceForLabourbyId(userId: string, labourId: string) {
    return this.database.collection("users").doc(userId).collection("labours").doc(labourId).collection("attendance").valueChanges();
  }

  addNewGroup(userId: string, groupName: string) {
    return this.database.collection("users").doc(userId).collection("groups").add({
      name: groupName,
      labourCount: 0
    });
  }

  getGroupList(userId: string) {
    return this.database.collection("users").doc(userId).collection("groups").snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as LabourType;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getCurrentGroupName(userId: string, groupId: string) {
    return this.database.collection("users").doc(userId).collection("groups").doc(groupId).valueChanges();
  }

  getLabourData(userId: string, groupId: string, labourId: string) {
    return this.database.collection("users").doc(userId).collection("groups").doc(groupId).collection("labours").doc(labourId).valueChanges();
  }

  getLabourAttendanceInfo(userId: string, groupId: string, labourId: string) {
    return this.database.collection("users").doc(userId).collection("groups").doc(groupId).collection("labours").doc(labourId).collection("attendance", ref => ref.orderBy('timeAdded', "desc")).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  addLabourAttendance(userId: string, groupId: string, labourId: string) {
    return this.database.collection("users").doc(userId).collection("groups").doc(groupId).collection("labours").doc(labourId).collection("attendance").add({
      timeAdded: Date.now(),
      salary: false,
      attendanceDate: new Date().toDateString()
    });
  }

  addLabourProxyAttendance(userId: string, groupId: string, labourId: string, dateToSet: string) {
    return this.database.collection("users").doc(userId).collection("groups").doc(groupId).collection("labours").doc(labourId).collection("attendance").add({
      timeAdded: Date.now(),
      salary: false,
      attendanceDate: dateToSet
    });
  }

  paySalaryForDay(userId: string, groupId: string, labourId: string, dayId: string) {
    return this.database.collection("users").doc(userId).collection("groups").doc(groupId).collection("labours").doc(labourId).collection("attendance").doc(dayId).update({
      salary: true
    });
  }

  clearLabourAdvance(userId: string, groupId: string, labourId: string) {
    return this.database.collection("users").doc(userId).collection("groups").doc(groupId).collection("labours").doc(labourId).update({
      advance: 0
    });
  }

  deleteLabourById(userId: string, groupId: string, labourId: string) {
    return this.database.collection("users").doc(userId).collection("groups").doc(groupId).collection("labours").doc(labourId).delete();
  }

  deleteGroupById(userId: string, groupId: string) {
    return this.database.collection("users").doc(userId).collection("groups").doc(groupId).delete();
  }

  updateAdvanceByLabourId(userId: string, groupId: string, labourId: string, updatedAdvance: string) {
    return this.database.collection("users").doc(userId).collection("groups").doc(groupId).collection("labours").doc(labourId).update({
      advance: updatedAdvance
    });
  }

  addNewSourceByUserId(userId: string, sourceData: SourceType) {
    return this.database.collection("users").doc(userId).collection("accounting").add({
      name: sourceData.name,
      location: sourceData.location,
      natureOfWork: sourceData.natureOfWork,
      advance: sourceData.advance
    });
  }

  getAccountingListByUserId(userId: string) {
    return this.database.collection("users").doc(userId).collection("accounting").snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as SourceType;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  deleteSourceById(userId: string, sourceId: string) {
    return this.database.collection("users").doc(userId).collection("accounting").doc(sourceId).delete();
  }

  getSourceDetailsById(userId: string, sourceId: string) {
    return this.database.collection("users").doc(userId).collection("accounting").doc(sourceId).valueChanges();
  }

  addNewSourceRecord(userId: string, sourceId: string, recordData: RecordType, date: string) {
    return this.database.collection("users").doc(userId).collection("accounting").doc(sourceId).collection("records").add({
      date: date == "" ? new Date().toDateString() : date,
      description: recordData.description,
      quantity: recordData.quantity,
      price: recordData.price,
      totalPrice: recordData.totalPrice,
      time: new Date(date == "" ? new Date().toDateString() : date)
    });
  }

  getAllRecordsBySourceId(userId: string, sourceId: string) {
    return this.database.collection("users").doc(userId).collection("accounting").doc(sourceId).collection("records", ref => ref.orderBy('time', 'desc')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as RecordType;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  updateSourceRecordByRecordId(userId: string, sourceId: string, recordId: string, recordData: RecordType) {
    return this.database.collection("users").doc(userId).collection("accounting").doc(sourceId).collection("records").doc(recordId).update({
      description: recordData.description,
      quantity: recordData.quantity,
      price: recordData.price,
      totalPrice: recordData.totalPrice
    });
  }

  deleteSourceRecordByRecordId(userId: string, sourceId: string, recordId: string) {
    return this.database.collection("users").doc(userId).collection("accounting").doc(sourceId).collection("records").doc(recordId).delete();
  }

  saveVehicleByUserId(userId: string, vehicleData: VehicleType) {
    return this.database.collection("users").doc(userId).collection("vehicles").add({
      vehicleName: vehicleData.vehicleName,
      vehicleNumber: vehicleData.vehicleNumber,
      properties: vehicleData.properties,
      fcDate: vehicleData.fcDate,
      insuranceDate: vehicleData.insuranceDate
    });
  }

  updateVehicleByUserId(userId: string, vehicleId: string, vehicleData: VehicleType) {
    return this.database.collection("users").doc(userId).collection("vehicles").doc(vehicleId).update({
      vehicleName: vehicleData.vehicleName,
      vehicleNumber: vehicleData.vehicleNumber,
      properties: vehicleData.properties,
      fcDate: vehicleData.fcDate,
      insuranceDate: vehicleData.insuranceDate
    });
  }

  getAllVehiclesByUserId(userId: string) {
    return this.database.collection("users").doc(userId).collection("vehicles").snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as VehicleType;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  saveRemainders(userId: string, remainder: RemainderType) {
    return this.database.collection("users").doc(userId).collection("remainders").add({
      title: remainder.title,
      date: remainder.date,
      active: remainder.active,
      lastUpdated: new Date().getFullYear()
    });
  }

  getRemainders(userId: string) {
    return this.database.collection("users").doc(userId).collection("remainders").snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as RemainderType;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  updateRemainderById(userId: string, remainder: RemainderType) {
    let oldDate = new Date(remainder.date);
    return this.database.collection("users").doc(userId).collection("remainders").doc(remainder.id).update({
      active: false,
      date: new Date(oldDate.getFullYear() + 1, oldDate.getMonth(), oldDate.getDate()).toDateString()
    });
  }

  getVehicleDetailsById(userId: string, vehicleId: string) {
    return this.database.collection("users").doc(userId).collection("vehicles").doc(vehicleId).valueChanges();
  }

  addNewRental(userId: string, name: string, natureOfWork: string, location: string) {
    return this.database.collection("users").doc(userId).collection("rentals").add({
      name: name,
      natureOfWork: natureOfWork,
      location: location
    });
  }

  getAllRentals(userId: string) {
    return this.database.collection("users").doc(userId).collection("rentals").snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as RemainderType;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getRentalInfoById(userId: string, rentalId: string) {
    return this.database.collection("users").doc(userId).collection("rentals").doc(rentalId).valueChanges();
  }

  deleteRentalById(userId: string, rentalId: string) {
    return this.database.collection("users").doc(userId).collection("rentals").doc(rentalId).delete();
  }

  saveRentalRecordById(userId: string, rentalId: string, vehicle: string, prop: string, price: number, dateToSet: string) {
    return this.database.collection("users").doc(userId).collection("rentals").doc(rentalId).collection("records").add({
      vehicleName: vehicle,
      property: prop,
      price: price,
      recordDate: dateToSet,
      isComplete: false,
      timestamp: Date.now()
    });
  }

  getRentalRecordsByRentalId(userId: string, rentalId: string) {
    return this.database.collection("users").doc(userId).collection("rentals").doc(rentalId).collection("records").snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  updateDriverFeeByUserId(userId: string, fee: number) {
    return this.database.collection("users").doc(userId).collection("others").doc("driverFee").set({
      value: fee
    });
  }

  getDriverFeeByUserId(userId: string) {
    return this.database.collection("users").doc(userId).collection("others").doc("driverFee").valueChanges();
  }

  completeRentalRecordById(userId: string, rentalId: string, recordId: string) {
    return this.database.collection("users").doc(userId).collection("rentals").doc(rentalId).collection("records").doc(recordId).update({
      isComplete: true
    });
  }

  deleteRentalRecordById(userId: string, rentalId: string, recordId: string) {
    return this.database.collection("users").doc(userId).collection("rentals").doc(rentalId).collection("records").doc(recordId).delete();
  }

  deleteVehicleByVehicleId(userId: string, vehicleId: string) {
    return this.database.collection("users").doc(userId).collection("vehicles").doc(vehicleId).delete();
  }
  
  getAllMileageList(userId: string) {
    return this.database.collection("users").doc(userId).collection("mileage").snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  addToMileageList(userId: string, vehicleName: string) {
    return this.database.collection("users").doc(userId).collection("mileage").add({
      name: vehicleName
    });
  }

  getVehicleNameByMileageId(userId: string, vehicleId: string) {
    return this.database.collection("users").doc(userId).collection("mileage").doc(vehicleId).valueChanges();
  }

  addNewMileageRecord(userId: string, vehicleId: string, amount: number, reading: number, litre: number) {
    return this.database.collection("users").doc(userId).collection("mileage").doc(vehicleId).collection("records").add({
      amount: amount,
      reading: reading,
      litre: litre,
      dateToDisplay: new Date().toDateString(),
      timestamp: Date.now(),
      mileage: 0
    });
  }

  getAllMileageRecordsByVehicleId(userId: string, vehicleId: string) {
    return this.database.collection("users").doc(userId).collection("mileage").doc(vehicleId).collection("records", ref => ref.orderBy('timestamp', 'asc')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
}
