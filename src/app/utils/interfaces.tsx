// export interface Agreement {
//     id: string;
//     key: string;
//     ictApprovalDate:Date;
//     agreementSigningDate:Date;
//     batchCount:number;
//     duration:number;
//     company:any;
//     tracks:any;
//   }

//   export interface Batch {
//     id: string;
//     key: string;
//     beginning_date: Date,
//     expected_ending_date: Date,
//     training_address: string,
//     trainee_recruitment_date: Date,
//     trainer_recruitment_date: Date,
//     inauguration_date: Date,
//     is_all_appointment_done: boolean,
//     secondPaymentStatus: boolean,
//     thirdPaymentStatus: boolean,
//     firstPaymentStatus: boolean,
//     isSuspended: boolean,
//     midStatus: boolean,
//     finalStatus: boolean,
//     agreement: Agreement,
//     trainerBatches: [],
//     track: Track
//   }

//   export interface Company {
//     id: string;
//     key: string;
//     name: string;
//     companyAddress: string;
//     phoneNo: string;
//     email: string;
//   }

//   export interface Faculty {
//     id: string;
//     key: string;
//     fullName: string;
//     designation: string;
//     institution: string;
//     phone: string;
//   }

//   export interface Track {
//     id: string;
//     key: string;
//     name: string;
//   }

//   // incomplete
//   export interface Trainee {
//     id: string;
//     key: string;
//     name: string;
//     fatherName:string;
//     motherName:string;
//     gender:string;
//     religion:string;
//     dateOfBirth:Date;
//     nationality:string;
//     nationalIdCardNo:string;
//     presentAddress:string;
//     permanentAddress:string;
//     mobileNumber:string;
//     guardianPhoneNumber:string;
//     passportNo:string;
//     highestEducationLevel:string;
//     highestExamTitle:string;
//     subjectGroup:string;
//     lastInstituteName:string;
//     positionHeld:string;
//     institution: string;
//     email: String;
//     phone: string;
//   }

//   export interface Trainer {
//     id: string;
//     key: string;
//     fullName: string;
//     institution: string;
//     email: String;
//     phone: string;
//   }

export interface Project {
    contributor: any;
    performance: any;
    id: string;
    key: React.Key;
    title: string;
}

export interface Document {
  performance: any;
  contributor: any;
  id: string;
  key: React.Key;
  title: string;
  project_id: string
}

export interface Requirement {
  id: string;
  key: React.Key;
  document_id: string;
  project_id: string;
  content: string;
  isSafe: boolean;
}

export interface Conflict{
  req2_content: string;
  req1_content: string;
  id: string;
  key: React.Key;
  req1_document_id: string;
  req2_document_id: string;
  project_id: string;
  req1_id: string;
  req2_id: string;
  cos: number;
  pos_overlap_ratio: number;
  decision: string;
}