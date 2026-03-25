<div align="center">

# 📑 AyuSangh Documentation Guide

**Central Reference Hub for Architecture & Design Artifacts**

![Version](https://img.shields.io/badge/version-1.0-blue?style=flat-square)
![Scope](https://img.shields.io/badge/scope-comprehensive-green?style=flat-square)
![Status](https://img.shields.io/badge/status-finalized-success?style=flat-square)

---

</div>

## 🎯 What You'll Find Here

This documentation hub consolidates all architectural decisions, technical standards, UML diagrams, and design artifacts for the AyuSangh platform.

### Quick Access
| Category | Purpose |
|----------|---------|
| 📖 [Core Docs](#1-core-reference-documents) | Official standards & tech decisions |
| 🏗️ [UML Structure](#2-uml-documentation-structure) | Diagram folder organization |
| 📊 [Diagram Inventory](#3-diagram-inventory-and-tool-used) | All diagrams with tools & status |
| 🔗 [External Links](#4-external-diagram-links) | Third-party hosted diagrams |
| ⚙️ [D2 Workflow](#5-d2-usage-notes) | D2 diagram creation guidelines |
| 📋 [Maintenance](#6-documentation-maintenance-rules) | Contributing guidelines |

---

## 1. Core Reference Documents

### 📘 Official Documentation

| Document | Purpose | Access |
|----------|---------|--------|
| **Tech Stack** | Official technology decisions & rationale | [Tech_stack.md](Tech_stack.md) |
| **Tech Doc (Google)** | Full detailed technical specification | [Google Doc](https://docs.google.com/document/d/1-G22isMKkl9s3SFiftLLafNPJfjmmNOha60sfwO6ZQk/edit?usp=sharing) |
| **Business Context** | Market analysis & feature requirements | [Google Doc](https://docs.google.com/document/d/1ZyYwcTCum-Fecm7d04Sa814q5Le95rPyNCcIVYWyaN0/edit?usp=sharing) |
| **Project README** | Quick project overview | [../README.md](../README.md) |

---

## 2. UML Documentation Structure

All diagrams are organized in a consistent folder layout for easy navigation.


### 📁 Folder Structure

```
📂 UML_Diagrams/
├── 📂 Class_Diagram/           Object-oriented architecture
├── 📂 ER_Diagrams/             Database and entity relationships
│   └── ER.md                   Link to dbdiagram.io model
├── 📂 Sequence_Diagrams/       Flow & interaction diagrams (D2)
│   ├── 📂 Admin_Updates_Institution_Profile/
│   ├── 📂 Search_Institutions/
│   └── 📂 Submit_Review/       Includes .d2 source & .svg output
└── 📂 UseCase_Diagram/         Feature & actor relationships
    └── UseCase.md             Link to shared diagram
```

---

## 3. Diagram Inventory and Tool Used

### 📊 Complete Diagram Matrix

| # | Diagram Type | Location | Tool | Status | Format |
|---|---|---|---|---|---|
| 1 | **Class Diagram** | [Class_Diagram](UML_Diagrams/Class_Diagram) | D2 | 🕐 Pending | .d2 |
| 2 | **ER Diagram** | [ER_Diagrams/ER.md](UML_Diagrams/ER_Diagrams/ER.md) | dbdiagram.io | ✅ Complete | Online |
| 3 | **Use Case Diagram** | [UseCase_Diagram/UseCase.md](UML_Diagrams/UseCase_Diagram/UseCase.md) | External | ✅ Complete | Shared Link |
| 4 | **Sequence: Admin Updates** | [Admin_Updates...](UML_Diagrams/Sequence_Diagrams/Admin_Updates_Institution_Profile/Admin_Updates_Institution_Profile.d2) | D2 | ✅ Complete | .d2 |
| 5 | **Sequence: Search Institutions** | [Search_Institutions...](UML_Diagrams/Sequence_Diagrams/Search_Institutions/Search_Institutions.d2) | D2 | ✅ Complete | .d2 |
| 6 | **Sequence: Submit Review** | [Submit_Review...](UML_Diagrams/Sequence_Diagrams/Submit_Review/Submit_Review.d2) | D2 | ✅ Complete | .d2 + .svg |

### 🎨 Diagram Details

#### Class Diagram
- **Path:** [Class_Diagram](UML_Diagrams/Class_Diagram)
- **Tool:** D2 (Diagram as Code)
- **Status:** 🕐 Pending - Folder ready for diagram source
- **Purpose:** Object-oriented system design and class relationships

#### Data Models (ER Diagram)
- **Path:** [ER_Diagrams/ER.md](UML_Diagrams/ER_Diagrams/ER.md)
- **Tool:** dbdiagram.io
- **Status:** ✅ Complete
- **Purpose:** Database schema, entities, and relationships
- **Access:** Live-editable model at https://dbdiagram.io/d/AyuSanghER_Capstion-69c11fee78c6c4bc7a45f552

#### Use Case Diagram
- **Path:** [UseCase_Diagram/UseCase.md](UML_Diagrams/UseCase_Diagram/UseCase.md)
- **Tool:** External (shared diagram file)
- **Status:** ✅ Complete
- **Purpose:** Actor interactions and system features
- **Access:** https://drive.google.com/file/d/1FBgxSePDBqD8_KT6PMWXYyx_829Le809/view?usp=sharing

#### 🔄 Sequence Diagrams (D2 Format)

**Sequence 1: Admin Updates Institution Profile**
- **File:** [Admin_Updates_Institution_Profile.d2](UML_Diagrams/Sequence_Diagrams/Admin_Updates_Institution_Profile/Admin_Updates_Institution_Profile.d2)
- **Tool:** D2
- **Status:** ✅ Complete
- **Flow:** Browser → API → Database (with JWT validation)

**Sequence 2: Search Institutions**
- **File:** [Search_Institutions.d2](UML_Diagrams/Sequence_Diagrams/Search_Institutions/Search_Institutions.d2)
- **Tool:** D2
- **Status:** ✅ Complete
- **Flow:** Frontend search → API → DB + Cache layer

**Sequence 3: Submit Review**
- **Source:** [Submit_Review.d2](UML_Diagrams/Sequence_Diagrams/Submit_Review/Submit_Review.d2)
- **Rendered:** [Submit_Review.svg](UML_Diagrams/Sequence_Diagrams/Submit_Review/Submit_Review.svg)
- **Tool:** D2 (source) + SVG export
- **Status:** ✅ Complete
- **Flow:** User submission → DTO validation → DB write → Rating calculation

---

## 4. External Diagram Links

### 🌐 Online Resources

| Resource | Type | Purpose | Link |
|----------|------|---------|------|
| ER Model | Database Design | Live entity-relationship diagram | [dbdiagram.io](https://dbdiagram.io/d/AyuSanghER_Capstion-69c11fee78c6c4bc7a45f552) |
| Use Case Diagram | Feature Mapping | Actor & system interactions | [Google Drive](https://drive.google.com/file/d/1FBgxSePDBqD8_KT6PMWXYyx_829Le809/view?usp=sharing) |

---

## 5. D2 Usage Notes

### 📌 About D2

D2 is a **diagram-as-code language** that allows version control and collaboration on diagrams through `.d2` source files.

### ✅ Diagrams Using D2

The following sequence diagrams are created and maintained in D2 format:
- ✓ Admin Updates Institution Profile
- ✓ Search Institutions
- ✓ Submit Review

### 🚀 Suggested D2 Workflow

1. **Edit source:** Update the `.d2` file in your text editor
2. **Render output:** Use D2 CLI to convert `.d2` → `.svg`
   ```bash
   d2 diagram.d2 diagram.svg
   ```
3. **Commit both:** Add both source (`.d2`) and rendered (`.svg`) to git
4. **Share rendered:** Use `.svg` for reports and presentations
5. **Maintain source:** Keep `.d2` for future updates

### 📦 Tools & References

- **D2 Language:** https://d2lang.com
- **D2 CLI:** https://github.com/terrastruct/d2
- **Online Editor:** https://play.d2lang.com

---

## 6. Documentation Maintenance Rules

### ✅ When Adding a New Diagram

Always document these **four required details:**

1. **Diagram Type** (e.g., Sequence, Class, ER)
2. **File Location** (e.g., `UML_Diagrams/MyDiagram/diagram.d2`)
3. **Tool Used** (e.g., D2, dbdiagram.io, Lucidchart)
4. **Current Status** (Pending, In Progress, or Complete)

### 📋 Update This File

- Update [Diagram Inventory](#3-diagram-inventory-and-tool-used) table
- Add descriptive details in [Diagram Details](#-diagram-details) section
- Include external links in [External Diagram Links](#4-external-diagram-links) if applicable

### 📂 File Organization Best Practices

- **Prefer local source files:** Store editable files (`.d2`, source XML, etc.) in the repository
- **Include rendered output:** For visual diagrams, keep export formats (`.svg`, `.png`) alongside source
- **One folder per diagram:** Keep related files in a single folder
- **Add README when needed:** Complex diagrams may need a local `README.md` explaining the flow

---

## 7. Quick Navigation

### 📍 Jump To

- **Main Project:** [../README.md](../README.md)
- **Tech Stack:** [Tech_stack.md](Tech_stack.md)
- **Diagrams Folder:** [UML_Diagrams](UML_Diagrams)
- **Class Diagram:** [UML_Diagrams/Class_Diagram](UML_Diagrams/Class_Diagram)
- **ER Diagram:** [UML_Diagrams/ER_Diagrams/ER.md](UML_Diagrams/ER_Diagrams/ER.md)
- **Use Case Diagram:** [UML_Diagrams/UseCase_Diagram/UseCase.md](UML_Diagrams/UseCase_Diagram/UseCase.md)
- **Sequence Diagrams:** [UML_Diagrams/Sequence_Diagrams](UML_Diagrams/Sequence_Diagrams)

---

<div align="center">

### 📖 Documentation Version: 1.0

**Maintained for:** AyuSangh Platform Development  
**Last Updated:** 2026 · Confidential - Internal Use Only

</div>



