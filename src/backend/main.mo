import Map "mo:core/Map";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  type ActivityCategory = {
    #academic;
    #administrative;
    #social;
    #research;
  };

  type TargetStatus = {
    #pending;
    #inProgress;
    #achieved;
  };

  type Activity = {
    id : Nat;
    title : Text;
    description : Text;
    date : Text;
    category : ActivityCategory;
  };

  type Target = {
    id : Nat;
    title : Text;
    description : Text;
    deadline : Text;
    status : TargetStatus;
  };

  type StudentPerformance = {
    id : Nat;
    studentName : Text;
    studentId : Text;
    subject : Text;
    grade : Text;
    semester : Text;
    remarks : ?Text;
  };

  module Activity {
    public func compare(a1 : Activity, a2 : Activity) : Order.Order {
      Nat.compare(a1.id, a2.id);
    };
  };

  module Target {
    public func compare(t1 : Target, t2 : Target) : Order.Order {
      Nat.compare(t1.id, t2.id);
    };
  };

  module StudentPerformance {
    public func compare(s1 : StudentPerformance, s2 : StudentPerformance) : Order.Order {
      Nat.compare(s1.id, s2.id);
    };
  };

  var nextActivityId = 1;
  var nextTargetId = 1;
  var nextPerformanceId = 1;

  let activities = Map.empty<Nat, Activity>();
  let targets = Map.empty<Nat, Target>();
  let performances = Map.empty<Nat, StudentPerformance>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Activity CRUD
  public shared ({ caller }) func createActivity(title : Text, description : Text, date : Text, category : ActivityCategory) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create activities");
    };
    let id = nextActivityId;
    activities.add(
      id,
      {
        id;
        title;
        description;
        date;
        category;
      },
    );
    nextActivityId += 1;
  };

  public shared ({ caller }) func updateActivity(id : Nat, title : Text, description : Text, date : Text, category : ActivityCategory) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update activities");
    };
    switch (activities.get(id)) {
      case (null) { Runtime.trap("Activity not found") };
      case (?_) {
        activities.add(
          id,
          {
            id;
            title;
            description;
            date;
            category;
          },
        );
      };
    };
  };

  public shared ({ caller }) func deleteActivity(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete activities");
    };
    activities.remove(id);
  };

  public query ({ caller }) func getActivity(id : Nat) : async Activity {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can read activities");
    };
    switch (activities.get(id)) {
      case (null) { Runtime.trap("Activity not found") };
      case (?activity) { activity };
    };
  };

  public query ({ caller }) func getAllActivities() : async [Activity] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can read activities");
    };
    activities.values().toArray().sort();
  };

  // Target CRUD
  public shared ({ caller }) func createTarget(title : Text, description : Text, deadline : Text, status : TargetStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create targets");
    };
    let id = nextTargetId;
    targets.add(
      id,
      {
        id;
        title;
        description;
        deadline;
        status;
      },
    );
    nextTargetId += 1;
  };

  public shared ({ caller }) func updateTarget(id : Nat, title : Text, description : Text, deadline : Text, status : TargetStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update targets");
    };
    switch (targets.get(id)) {
      case (null) { Runtime.trap("Target not found") };
      case (?_) {
        targets.add(
          id,
          {
            id;
            title;
            description;
            deadline;
            status;
          },
        );
      };
    };
  };

  public shared ({ caller }) func deleteTarget(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete targets");
    };
    targets.remove(id);
  };

  public query ({ caller }) func getTarget(id : Nat) : async Target {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can read targets");
    };
    switch (targets.get(id)) {
      case (null) { Runtime.trap("Target not found") };
      case (?target) { target };
    };
  };

  public query ({ caller }) func getAllTargets() : async [Target] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can read targets");
    };
    targets.values().toArray().sort();
  };

  // Student Performance CRUD
  public shared ({ caller }) func createStudentPerformance(studentName : Text, studentId : Text, subject : Text, grade : Text, semester : Text, remarks : ?Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create student performance records");
    };
    let id = nextPerformanceId;
    performances.add(
      id,
      {
        id;
        studentName;
        studentId;
        subject;
        grade;
        semester;
        remarks;
      },
    );
    nextPerformanceId += 1;
  };

  public shared ({ caller }) func updateStudentPerformance(id : Nat, studentName : Text, studentId : Text, subject : Text, grade : Text, semester : Text, remarks : ?Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update student performance records");
    };
    switch (performances.get(id)) {
      case (null) { Runtime.trap("Student performance record not found") };
      case (?_) {
        performances.add(
          id,
          {
            id;
            studentName;
            studentId;
            subject;
            grade;
            semester;
            remarks;
          },
        );
      };
    };
  };

  public shared ({ caller }) func deleteStudentPerformance(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete student performance records");
    };
    performances.remove(id);
  };

  public query ({ caller }) func getStudentPerformance(id : Nat) : async StudentPerformance {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can read student performance records");
    };
    switch (performances.get(id)) {
      case (null) { Runtime.trap("Student performance record not found") };
      case (?performance) { performance };
    };
  };

  public query ({ caller }) func getAllStudentPerformances() : async [StudentPerformance] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can read student performance records");
    };
    performances.values().toArray().sort();
  };
};
