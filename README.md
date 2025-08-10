# upliance.ai Form Builder

A dynamic form builder built with React, TypeScript, Redux, Material-UI, and localStorage. This project is an assignment for the Associate Software Developer position at upliance.ai.

## Features
- Create dynamic forms with customizable fields and validations
- Preview forms as an end user
- View and manage a list of saved forms
- All form configurations are persisted in localStorage (no backend)

## Tech Stack
- React + TypeScript
- Redux Toolkit
- Material-UI (MUI)
- localStorage

## Routes
- `/` — Welcome/landing page
- `/create` — Build a new form by dynamically adding and configuring fields
- `/preview` — Interact with the currently built form like an end user
- `/myforms` — View all previously saved forms from localStorage

## Form Builder Features
- Add fields: Text, Number, Textarea, Select, Radio, Checkbox, Date
- Configure each field: Label, Required, Default value, Validations (not empty, min/max length, email, password rule)
- Mark fields as Derived Fields: select parent field(s) and define a formula
- Reorder or delete fields
- Save the form: prompt for a form name and store the schema in localStorage

## Preview Features
- Render the form as an end user
- All fields support user input and validation
- Show validation error messages
- Derived fields auto-update as parent fields change

## My Forms Features
- List all saved forms from localStorage
- Each entry shows form name and creation date
- Clicking a form opens its preview page

## Getting Started

### Prerequisites
- Node.js (v14 or higher recommended)
- npm

### Installation
```bash
cd upliance
npm install
```

### Running the App
```bash
npm start
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
```

## Deployment
You can deploy this app to Vercel, Netlify, or any static hosting provider.

## License
This project is for assignment/demo purposes only.
