# Staff Profile System Action Plan

## Overview
Transform `/dashboard/staff/profile` into a comprehensive HR profile system where staff can enter their data in organized card groups, with some data visible but managed by admin.

## Current State Analysis
- **Route**: `/dashboard/staff/profile` ✅ Working
- **Basic Structure**: 3 tabs (Personal, Contact, Employment) ✅ Basic
- **Missing**: 80% of HR profile fields, proper grouping, admin-managed data display
- **API**: `/api/users/[id]` endpoint exists ✅ Basic CRUD

## Target State
Complete HR profile system with:
- **8 Profile Sections** in organized cards
- **Staff Editable Fields**: Personal info, contact, addresses, skills, languages, education, work experience
- **Admin Managed Fields**: Employment details, salary,bouns,  department assignments,start day,
- **Profile Completion Tracking**: Visual progress indicator
- **Data Validation**: Zod schemas for all sections

## Implementation Strategy

### **Frontend-First Approach**
Start with frontend mockup data and UI components, then integrate with existing backend.

### **Current Database Analysis**
Your Prisma User model already has extensive HR profile fields:
- ✅ **Personal Info**: fullName, dateOfBirth, gender, nationality, profileImage
- ✅ **Contact Info**: mobilePrimary, homePhone, workExtension, alternativeEmail  
- ✅ **Employment Info**: hireDate, contractType, employmentStatus, jobTitle, basicSalary, bonus
- ✅ **Address**: addressStreet, addressCity, addressCountry (flattened)
- ✅ **Emergency Contact**: emergencyContactName, emergencyContactPhone, emergencyContactRelationship
- ✅ **Education & Skills**: educationLevel, fieldOfStudy, generalSkills, generalExperience
- ✅ **Related Models**: Language[], Education[], WorkExperience[]

## Implementation Plan

### Phase 1: Frontend Mockup & UI Structure (Week 1)

#### 1.1 Update Profile Client Component
**File**: `app/dashboard/staff/profile/StaffProfileClient.tsx`

**Changes**:
- Replace tabs with card-based layout
- Add profile completion progress bar
- Implement section-based navigation
- **Use mockup data first** (no API calls initially)
- Add save/load states for each section

**New Structure**:
```tsx
// Profile sections as cards instead of tabs
<div className="space-y-6">
  <ProfileCompletionBar completion={profileCompletion} />
  
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <PersonalInfoCard data={personalData} onSave={savePersonal} />
    <ContactInfoCard data={contactData} onSave={saveContact} />
    <AddressCard data={addressData} onSave={saveAddress} />
    <EmergencyContactCard data={emergencyData} onSave={saveEmergency} />
    <SkillsCard data={skillsData} onSave={saveSkills} />
    <LanguagesCard data={languagesData} onSave={saveLanguages} />
    <EducationCard data={educationData} onSave={saveEducation} />
    <WorkExperienceCard data={workData} onSave={saveWork} />
  </div>
  
  <AdminManagedCard data={adminData} readOnly={true} />
</div>
```

#### 1.2 Profile Completion Tracking
**Component**: `ProfileCompletionBar.tsx`

**Features**:
- Visual progress bar (0-100%)
- Required vs optional field indicators
- Completion status per section
- **Mockup data calculation** (no backend integration initially)
- Save progress automatically

### Phase 2: Profile Data Sections with Mockup Data (Week 2)

#### 2.1 Personal Information Card
**Fields**:
- Full Name (required)
- Date of Birth
- Gender (MALE/FEMALE)
- Nationality
- Profile Image URL
- Marital Status
- Blood Type

**Permissions**: Staff editable

#### 2.2 Contact Information Card
**Fields**:
- Primary Mobile
- Home Phone
- Work Extension
- Alternative Email
- Emergency Contact Name
- Emergency Contact Phone
- Emergency Contact Relationship

**Permissions**: Staff editable

#### 2.3 Address Information Card
**Fields**:
- Current Address (Street, City, State, Country, Postal Code)
- Permanent Address
- Address Type (Current/Permanent)
- Address Verification Status

**Permissions**: Staff editable

#### 2.4 Skills & Languages Card
**Fields**:
- Technical Skills (name, level, certification, expiry)
- Languages (language, proficiency, certified)
- Soft Skills
- Certifications

**Permissions**: Staff editable

#### 2.5 Education & Experience Card
**Fields**:
- Education History (degree, institution, field, dates, GPA)
- Work Experience (company, position, dates, description)
- Training & Certifications

**Permissions**: Staff editable

#### 2.6 Admin Managed Card (Read-Only)
**Fields**:
- Employee ID (use existing User.id)
- Department (use existing User.department)
- Job Title (use existing User.jobTitle)
- Hire Date (use existing User.hireDate)
- Contract Type (use existing User.contractType)
- Employment Status (use existing User.employmentStatus)
- Direct Manager (use existing User.directManager relation)
- Salary Information (use existing User.basicSalary, User.bonus)
- Work Schedule (use existing User.workSchedule)
- Work Location (use existing User.workLocation)

**Permissions**: Admin only (staff can view)
**Data Source**: Existing Prisma User model fields

### Phase 3: Backend Integration & API (Week 3)

#### 3.1 Enhanced User API
**File**: `app/api/users/[id]/route.ts`

**Enhance existing endpoint**:
```typescript
// GET - Load full profile with all sections (enhance existing)
GET /api/users/[id]?include=all

// PUT - Update user profile (enhance existing)
PUT /api/users/[id]

// GET - Profile completion status (new)
GET /api/users/[id]/completion
```

**Note**: Use existing User model fields, no need for separate section endpoints initially

#### 3.2 Profile Section APIs
**Enhance existing files**:
- `app/api/users/[id]/route.ts` - Enhance GET/PUT to handle all profile fields
- `app/api/users/[id]/completion/route.ts` - New endpoint for completion status

**No need for separate section endpoints** - use existing User model structure

#### 3.3 Data Validation Schemas
**File**: `lib/validations/hr-profile.ts`

**Enhance existing schemas**:
- ✅ **Already exists**: personalInfoSchema, contactInfoSchema, employmentInfoSchema
- **Add missing fields**: Update schemas to match Prisma User model
- **Cross-field validation**: Add validation rules for related fields
- **Profile completion**: Create schema for completion calculation

### Phase 4: Frontend-Backend Integration (Week 4)

#### 4.1 Profile Section Cards
**Components to create**:
- `PersonalInfoCard.tsx` - Use existing User fields
- `ContactInfoCard.tsx` - Use existing User fields  
- `AddressCard.tsx` - Use existing User flattened address fields
- `EmergencyContactCard.tsx` - Use existing User emergency contact fields
- `SkillsCard.tsx` - Use existing User.generalSkills + Language[] relation
- `LanguagesCard.tsx` - Use existing Language[] relation
- `EducationCard.tsx` - Use existing Education[] relation
- `WorkExperienceCard.tsx` - Use existing WorkExperience[] relation
- `AdminManagedCard.tsx` - Use existing User employment fields

**Features**:
- Form validation with Zod (use existing schemas)
- **Replace mockup data with real API calls**
- Error handling
- Loading states
- Success notifications

#### 4.2 Form Components
**Enhanced form fields**:
- Date pickers
- Dropdown selects
- File uploads (profile image)
- Multi-select (skills, languages)
- Dynamic arrays (education, experience)

#### 4.3 Profile Completion UI
**Components**:
- Progress bar with sections
- Completion percentage
- Required field indicators
- Save status per section

### Phase 5: Admin Integration & Polish (Week 5)

#### 5.1 Admin Profile Management
**Route**: `/dashboard/admin/staff/[id]/profile`

**Features**:
- View complete staff profiles
- Edit admin-managed fields
- Approve profile changes
- Profile completion tracking
- Bulk profile operations

#### 5.2 Profile Approval Workflow
**Process**:
1. Staff submits profile changes
2. Admin reviews changes
3. Admin approves/rejects with comments
4. Staff notified of status
5. Changes applied to profile

### Phase 6: Testing & Final Polish (Week 6)

#### 6.1 Testing
- Unit tests for validation schemas
- Integration tests for API endpoints
- E2E tests for profile workflows
- Performance testing for large profiles

#### 6.2 UI/UX Polish
- Responsive design for mobile
- Accessibility improvements
- Loading states and animations
- Error handling and user feedback
- Profile completion celebrations

## Technical Implementation Details

### Database Schema Analysis
**File**: `prisma/schema.prisma`

**Existing User Model** ✅ **Already Complete**:
```prisma
model User {
  // Personal Info
  fullName          String?
  dateOfBirth       DateTime?
  gender            Gender?
  nationality       String?
  profileImage      String?
  
  // Contact Info
  mobilePrimary    String?
  homePhone        String?
  workExtension    String?
  alternativeEmail String?
  
  // Employment Info
  hireDate         DateTime?
  contractType     ContractType?
  employmentStatus EmploymentStatus?
  jobTitle         String?
  basicSalary      String?
  bonus            String?
  
  // Address (flattened)
  addressStreet    String?
  addressCity      String?
  addressCountry   String?
  
  // Emergency Contact
  emergencyContactName          String?
  emergencyContactPhone         String?
  emergencyContactRelationship  String?
  
  // Education & Skills
  educationLevel   String?
  fieldOfStudy     String?
  generalSkills    String?
  generalExperience String?
  
  // Relations
  languages        Language[]
  education        Education[]
  workExperience   WorkExperience[]
}
```

**No schema changes needed** - all fields already exist!

### State Management
**Approach**: React Hook Form + Zod + Local state

**Benefits**:
- Form validation
- Auto-save
- Error handling
- Performance optimization

### API Design
**RESTful endpoints**:
- Resource-based URLs
- Consistent response format
- Error handling
- Rate limiting
- Authentication & authorization

## Success Metrics

### Profile Completion
- **Target**: 90% of staff have complete profiles
- **Measurement**: Profile completion percentage
- **Tracking**: Admin dashboard metrics

### User Engagement
- **Target**: 80% of staff update profiles monthly
- **Measurement**: Profile update frequency
- **Tracking**: Analytics dashboard

### Data Quality
- **Target**: 95% of profiles pass validation
- **Measurement**: Validation error rate
- **Tracking**: Form submission logs

## Risk Mitigation

### Data Security
- **Risk**: Sensitive HR data exposure
- **Mitigation**: Role-based access control, data encryption

### Performance
- **Risk**: Large profile data impact on load times
- **Mitigation**: Lazy loading, pagination, caching

### User Adoption
- **Risk**: Staff resistance to profile completion
- **Mitigation**: Gamification, progress tracking, admin incentives

## Timeline Summary

| Week | Phase | Deliverables |
|------|-------|--------------|
| 1 | **Frontend Mockup** | Profile layout, completion tracking, mockup data |
| 2 | **Profile Cards** | All 8 profile section cards with mockup data |
| 3 | **Backend Integration** | Enhanced APIs, real data loading |
| 4 | **Data Integration** | Replace mockup with real API calls |
| 5 | **Admin Features** | Admin profile management, polish |
| 6 | **Testing & Polish** | Testing, UI improvements, final touches |

## **TASK CHECKLIST - START HERE** ✅

### **PHASE 1: Frontend Mockup & UI Structure (Week 1)**

#### **1.1 Profile Layout & Structure**
- [ ] Create `ProfileCompletionBar.tsx` component
- [ ] Update `StaffProfileClient.tsx` to use card layout instead of tabs
- [ ] Add mockup data structure for all profile sections
- [ ] Implement basic grid layout for profile cards
- [ ] Add profile completion calculation logic

#### **1.2 Mockup Data Setup**
- [ ] Create mockup data for Personal Information
- [ ] Create mockup data for Contact Information  
- [ ] Create mockup data for Address Information
- [ ] Create mockup data for Emergency Contact
- [ ] Create mockup data for Skills & Languages
- [ ] Create mockup data for Education & Experience
- [ ] Create mockup data for Admin Managed fields

#### **1.3 Basic Components**
- [ ] Create `PersonalInfoCard.tsx` (display only, no forms yet)
- [ ] Create `ContactInfoCard.tsx` (display only, no forms yet)
- [ ] Create `AddressCard.tsx` (display only, no forms yet)
- [ ] Create `EmergencyContactCard.tsx` (display only, no forms yet)
- [ ] Create `SkillsCard.tsx` (display only, no forms yet)
- [ ] Create `LanguagesCard.tsx` (display only, no forms yet)
- [ ] Create `EducationCard.tsx` (display only, no forms yet)
- [ ] Create `WorkExperienceCard.tsx` (display only, no forms yet)
- [ ] Create `AdminManagedCard.tsx` (read-only display)

---

### **PHASE 2: Profile Cards with Forms (Week 2)**

#### **2.1 Form Implementation**
- [ ] Add React Hook Form to `PersonalInfoCard.tsx`
- [ ] Add React Hook Form to `ContactInfoCard.tsx`
- [ ] Add React Hook Form to `AddressCard.tsx`
- [ ] Add React Hook Form to `EmergencyContactCard.tsx`
- [ ] Add React Hook Form to `SkillsCard.tsx`
- [ ] Add React Hook Form to `LanguagesCard.tsx`
- [ ] Add React Hook Form to `EducationCard.tsx`
- [ ] Add React Hook Form to `WorkExperienceCard.tsx`

#### **2.2 Form Validation**
- [ ] Update Zod schemas in `lib/validations/hr-profile.ts`
- [ ] Add validation to Personal Information form
- [ ] Add validation to Contact Information form
- [ ] Add validation to Address Information form
- [ ] Add validation to Emergency Contact form
- [ ] Add validation to Skills & Languages form
- [ ] Add validation to Education & Experience form

#### **2.3 Form Features**
- [ ] Add save/load states to all forms
- [ ] Add error handling to all forms
- [ ] Add success notifications to all forms
- [ ] Implement mockup data persistence (localStorage)
- [ ] Add form reset functionality

---

### **PHASE 3: Backend Integration (Week 3)**

#### **3.1 API Enhancement**
- [ ] Enhance `GET /api/users/[id]` to include all profile relations
- [ ] Enhance `PUT /api/users/[id]` to handle all profile fields
- [ ] Create `GET /api/users/[id]/completion` endpoint
- [ ] Test API endpoints with Postman/Thunder Client

#### **3.2 Data Loading**
- [ ] Replace mockup data loading with API calls
- [ ] Add loading states for API calls
- [ ] Add error handling for API failures
- [ ] Implement data caching strategy

---

### **PHASE 4: Real Data Integration (Week 4)**

#### **4.1 Replace Mockup with Real Data**
- [ ] Update `PersonalInfoCard.tsx` to use real API data
- [ ] Update `ContactInfoCard.tsx` to use real API data
- [ ] Update `AddressCard.tsx` to use real API data
- [ ] Update `EmergencyContactCard.tsx` to use real API data
- [ ] Update `SkillsCard.tsx` to use real API data
- [ ] Update `LanguagesCard.tsx` to use real API data
- [ ] Update `EducationCard.tsx` to use real API data
- [ ] Update `WorkExperienceCard.tsx` to use real API data
- [ ] Update `AdminManagedCard.tsx` to use real API data

#### **4.2 Form Submission**
- [ ] Connect all forms to real API endpoints
- [ ] Add form submission success handling
- [ ] Add form submission error handling
- [ ] Implement auto-save functionality

---

### **PHASE 5: Admin Features & Polish (Week 5)**

#### **5.1 Admin Integration**
- [ ] Create admin profile view route `/dashboard/admin/staff/[id]/profile`
- [ ] Implement admin profile editing for employment fields
- [ ] Add profile completion tracking for admins
- [ ] Create admin profile approval workflow

#### **5.2 UI/UX Polish**
- [ ] Add responsive design for mobile devices
- [ ] Improve loading states and animations
- [ ] Add accessibility improvements
- [ ] Implement profile completion celebrations

---

### **PHASE 6: Testing & Final Polish (Week 6)**

#### **6.1 Testing**
- [ ] Test all form validations
- [ ] Test API endpoints
- [ ] Test admin functionality
- [ ] Test responsive design
- [ ] Test accessibility features

#### **6.2 Final Polish**
- [ ] Fix any bugs found during testing
- [ ] Optimize performance
- [ ] Add final UI improvements
- [ ] Create user documentation
- [ ] Prepare for deployment

---

## **QUICK START CHECKLIST** 🚀

### **Day 1-2: Get Started**
- [ ] **Check current staff profile route** - `/dashboard/staff/profile`
- [ ] **Review existing Prisma User model** - confirm all fields exist
- [ ] **Create mockup data structure** - JSON objects for each section
- [ ] **Start with ProfileCompletionBar** - simple progress component

### **Day 3-4: Basic Layout**
- [ ] **Replace tabs with cards** in `StaffProfileClient.tsx`
- [ ] **Create first 2-3 profile cards** (Personal, Contact, Address)
- [ ] **Test layout responsiveness** on different screen sizes

### **Day 5-7: Forms & Validation**
- [ ] **Add React Hook Form** to first 2-3 cards
- [ ] **Implement Zod validation** for basic fields
- [ ] **Test form submission** with mockup data

---

## **SUCCESS CRITERIA** 🎯

### **Phase 1 Complete When:**
- [ ] Profile displays in card layout (no tabs)
- [ ] Progress bar shows completion percentage
- [ ] All 8 profile sections display mockup data
- [ ] Layout is responsive on mobile/desktop

### **Phase 2 Complete When:**
- [ ] All forms have proper validation
- [ ] Forms can save/load mockup data
- [ ] Error handling works for invalid inputs
- [ ] Success notifications appear after save

### **Phase 3 Complete When:**
- [ ] API endpoints return real data
- [ ] Forms load data from API
- [ ] Profile completion calculation works
- [ ] No more mockup data in components

### **Final Goal:**
- [ ] Staff can view/edit their complete HR profile
- [ ] Admins can manage employment-related fields
- [ ] Profile completion tracking works accurately
- [ ] System is ready for production use

---

## **RESOURCES & FILES TO WORK WITH**

### **Frontend Components:**
- `app/dashboard/staff/profile/StaffProfileClient.tsx` - Main profile component
- `app/dashboard/staff/profile/` - Create new card components here

### **Backend APIs:**
- `app/api/users/[id]/route.ts` - Enhance existing user API
- `app/api/users/[id]/completion/route.ts` - New completion endpoint

### **Validation:**
- `lib/validations/hr-profile.ts` - Update existing Zod schemas

### **Database:**
- `prisma/schema.prisma` - User model already has all needed fields ✅

---

**Start with Phase 1, Day 1-2 tasks!** 🚀

## Resources Required

### Development Team
- **Frontend Developer**: 1 FTE (6 weeks)
- **Backend Developer**: 1 FTE (6 weeks)
- **UI/UX Designer**: 0.5 FTE (3 weeks)

### Infrastructure
- **Database**: MongoDB (existing)
- **File Storage**: Cloudinary (existing)
- **API**: Next.js API routes (existing)

### Dependencies
- **React Hook Form**: Form management
- **Zod**: Validation schemas
- **Tailwind CSS**: Styling (existing)
- **Shadcn UI**: Component library (existing)

---

*This action plan provides a comprehensive roadmap for implementing a professional staff profile system that balances staff autonomy with administrative oversight.*
