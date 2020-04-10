import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { map } from 'rxjs/operators';
import { LabourType } from '../models/LabourType';

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
}
