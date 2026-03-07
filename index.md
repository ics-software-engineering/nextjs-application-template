![](https://github.com/ics-software-engineering/nextjs-application-template/raw/main/doc/landing-page.png)

nextjs-application-template is a sample Next.js 16 application that illustrates:

- A standard directory layout using 'src/' as recommended in the [Next.js Project Structure](https://nextjs.org/docs/getting-started/project-structure) guide.
- [Bootstrap 5 React](https://react-bootstrap.github.io/) for user interface.
- [React Hook Form](https://www.react-hook-form.com/) for form development.
- Authorization, authentication, and registration using [NextAuth.js](https://next-auth.js.org/).
- Initialization of users and data from a settings file.
- Alerts regarding success or failure of DB updates using [Sweet Alert](https://sweetalert.js.org/).
- Quality assurance using [ESLint](http://eslint.org) with packages to partially enforce the [Next.js ESLint rules](https://nextjs.org/docs/app/building-your-application/configuring/eslint).

The goal of this template is to help you get quickly started doing Next.js development by providing a reasonable directory structure for development and deployment, a set of common extensions to the core framework, and boilerplate code to implement basic page display, navigation, forms, roles, and database manipulation.

To keep this codebase simple and small, some important capabilities are intentionally excluded from this template:

- Unit Testing
- Security
- Deployment

Examples of the these capabilities will be provided elsewhere.

## Installation

First, [install PostgreSQL](https://www.postgresql.org/download/). Then create a database for your application.

```

$ createdb nextjs-application-template
Password:
$

```

Second, go to [https://github.com/ics-software-engineering/nextjs-application-template](https://github.com/ics-software-engineering/nextjs-application-template-s26), and click the "Use this template" button. Complete the dialog box to create a new repository that you own that is initialized with this template's files.

Third, go to your newly created repository, and click the "Clone or download" button to download your new GitHub repo to your local file system. Using [GitHub Desktop](https://desktop.github.com/) is a great choice if you use MacOS or Windows.

Fourth, cd into the directory of your local copy of the repo, and install third party libraries with:

```

$ npm install

```

Fifth, create a `.env` file from the `sample.env`. Edit the line `DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"` to match your setup. Replace `mydb` with the PostgreSQL database that you created in the first step (in the example for this step the database is `nextjs-application-template`). replace `johndoe:randompassword` with a username and password you created for this db. If you did not create a user for this database, you can use the `postgress` user with the password you set when you installed postgress. Note: this is not a recommdened practice since the `postgres` user is an admin with full access to postgres. 

See the Prisma docs [Connect your database](https://www.prisma.io/docs/prisma-orm/add-to-existing-project/postgresql#3-connect-your-database). 

Then run the Prisma migration `npx prisma migrate dev` to set up the PostgreSQL tables.

```
$ npx prisma migrate dev
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.
Datasource "db": PostgreSQL database "mydb", schema "public" at "localhost:5432"

Applying migration `20260301195634_init`

The following migration(s) have been applied:

migrations/
  └─ 20260301195634_init/
    └─ migration.sql

Your database is now in sync with your schema.

$

```

Create the Prisma Client by running the command `npx prisma generate`. This will create the Prisma Client in the `generated/prisma` directory, which is used by the application to interact with the database.

```
$ npx prisma generate

Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma/schema.prisma.

Generated Prisma Client (7.4.2) to ./generated/prisma in 80ms
 
```

Then seed the database with the `/config/settings.development.json` data using `npm run seed`.

```

$ npm run seed  

> nextjs-application-template-s26@0.1.0 seed
> npx tsx src/seed.ts

Seeding the database
  Creating user: admin@foo.com with role: ADMIN
  Creating user: john@foo.com with role: USER
  Adding stuff: {"name":"Basket","quantity":3,"owner":"john@foo.com","condition":"excellent"}
  Adding stuff: {"name":"Bicycle","quantity":2,"owner":"john@foo.com","condition":"poor"}
  Adding stuff: {"name":"Banana","quantity":2,"owner":"admin@foo.com","condition":"good"}
  Adding stuff: {"name":"Boogie Board","quantity":2,"owner":"admin@foo.com","condition":"excellent"}
$

```

## Running the system

Once the libraries are installed and the database seeded, you can run the application by invoking the "dev" script in the [package.json file](https://github.com/ics-software-engineering/nextjs-application-template/blob/master/app/package.json):

```

$ npm run dev

> nextjs-application-template-s26@0.1.0 dev
> next dev

▲ Next.js 16.1.6 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://XXX.XXX.XXX.XXX:3000
- Environments: .env

✓ Starting...
✓ Ready in 821ms

```

### Viewing the running app

If all goes well, the template application will appear at [http://localhost:3000](http://localhost:3000). You can login using the credentials in [settings.development.json](https://github.com/ics-software-engineering/nextjs-application-template/blob/main/config/settings.development.json), or else register a new account.

### ESLint

You can verify that the code obeys our coding standards by running ESLint over the code in the src/ directory with:

```
$ npm run lint

> nextjs-application-template-1@0.1.0 lint
> next lint

✔ No ESLint warnings or errors
$
```

## Walkthrough

The following sections describe the major features of this template.

### Directory structure

The top-level directory structure is:

```

.github # holds the GitHub Continuous Integration action and Issue template.

config/ # holds configuration files, such as settings.development.json

doc/ # holds developer documentation, user guides, etc.

prisma/ # holds the Prisma ORM schema and seed.ts files.

public/ # holds the public images.

src/ # holds the application files.

tests/ # holds the Playwright acceptance tests.

.eslintrc.json # The ESLint configuration.

.gitignore # don't commit VSCode settings files, node_modules, and settings.production.json

```

This structure separates documentation files (such as screenshots) and configuration files (such as the settings files) from the actual Next.js application.

The src/ directory has this structure:

```

app/

  add/ # The add route
    page.tsx # The Add Stuff Page

  admin/
    page.tsx # The Admin Page

  api/auth/[...nextauth]/
    route.ts # The NextAuth configuration

  auth/
    change-password/
      page.tsx # The Change Password Page

    signin/
      page.tsx # The Sign In Page

    signout/
      page.tsx # The Sign Out Page

    signup/
      page.tsx # The Sign Up / Register Page

  edit/
    page.tsx # The Edit Stuff Page

  list/
    page.tsx # The List Stuff Page

  not-authorized/
    page.tsx # The Not Authorized Page

  layout.tsx # The layout of the application

  page.tsx # The Landing Page

  providers.tsx # Session providers.

  components/
    AddStuffForm.tsx # The React Hook Form for adding stuff.

    EditStuffForm.tsx # The Edit Stuff Form.

    Footer.tsx # The application footer.

    LoadingSpinner.tsx # Indicates working.

    Navbar.tsx # The application navbar.

    StuffItem.tsx # Row in the list stuff page.

    StuffItemAdmin.tsx # Row in the admin list stuff page.

  lib/

    dbActions.ts # Functions to manipulate the Postgres database.

    page-protections.ts # Functions to check for logged in users and their roles.

    prisma.ts # Singleton Prisma client.

    validationSchemas.ts # Yup schemas for validating forms.

  tests/ # playwright acceptance tests.

```

### Application functionality

The application implements a simple CRUD application for managing "Stuff", which is a PostgreSQL table consisting of a name (String), a quantity (Number), a condition (one of 'excellent', 'good', 'fair', or 'poor') and an owner.

By default, each user only sees the Stuff that they have created. However, the settings file enables you to define default accounts. If you define a user with the role "admin", then that user gets access to a special page which lists all the Stuff defined by all users.

#### Landing page

When you retrieve the app at http://localhost:3000, this is what should be displayed:

![](https://github.com/ics-software-engineering/nextjs-application-template/raw/main/doc/landing-page.png)

The next step is to use the Login menu to either Login to an existing account or register a new account.

#### Login page

Clicking on the Login link, then on the Sign In menu item displays this page:

![](https://github.com/ics-software-engineering/nextjs-application-template/raw/main/doc/signin-page.png)

#### Register page

Alternatively, clicking on the Login link, then on the Sign Up menu item displays this page:

![](https://github.com/ics-software-engineering/nextjs-application-template/raw/main/doc/register-page.png)

#### Landing (after Login) page, non-Admin user

Once you log in (either to an existing account or by creating a new one), the navbar changes as follows:

![](https://github.com/ics-software-engineering/nextjs-application-template/raw/main/doc/landing-after-login-page.png)

You can now add new Stuff documents, and list the Stuff you have created. Note you cannot see any Stuff created by other users.

#### Add Stuff page

After logging in, here is the page that allows you to add new Stuff:

![](https://github.com/ics-software-engineering/nextjs-application-template/raw/main/doc/add-stuff-page.png)

#### List Stuff page

After logging in, here is the page that allows you to list all the Stuff you have created:

![](https://github.com/ics-software-engineering/nextjs-application-template/raw/main/doc/list-stuff-page.png)

You click the "Edit" link to go to the Edit Stuff page, shown next.

#### Edit Stuff page

After clicking on the "Edit" link associated with an item, this page displays that allows you to change and save it:

![](https://github.com/ics-software-engineering/nextjs-application-template/raw/main/doc/edit-stuff-page.png)

#### Landing (after Login), Admin user

You can define an "admin" user in the settings.json file. This user, after logging in, gets a special entry in the navbar:

![](https://github.com/ics-software-engineering/nextjs-application-template/raw/main/doc/admin-landing-page.png)

#### Admin page (list all users stuff)

To provide a simple example of a "super power" for Admin users, the Admin page lists all of the Stuff by all of the users:

![](https://github.com/ics-software-engineering/nextjs-application-template/raw/main/doc/admin-list-stuff-page.png)

Note that non-admin users cannot get to this page, even if they type in the URL by hand.

### Tables

The application implements two tables "Stuff" and "User". Each Stuff row has the following columns: id, name, quantity, condition, and owner. The User table has the following columns: id, email, password (hashed using bcrypt), role.

The Stuff and User models are defined in [prisma/schema.prisma](https://github.com/ics-software-engineering/nextjs-application-template/blob/main/prisma/schema.prisma).

The tables are initialized in [prisma/seed.ts](https://github.com/ics-software-engineering/nextjs-application-template/blob/main/prisma/seed.ts) using the command `npx prisma db seed`.

### CSS

The application uses the [React implementation of Bootstrap 5](https://react-bootstrap.github.io/). You can adjust the theme by editing the `src/app/globals.css` file. To change the theme override the Bootstrap 5 CSS variables.

```css
/* Change bootstrap variable values.
 See https://getbootstrap.com/docs/5.2/customize/css-variables/
 */
body {
  --bs-light-rgb: 236, 236, 236;
}

/* Define custom styles */
.gray-background {
  background-color: var(--bs-gray-200);
  color: var(--bs-dark);
  padding-top: 10px;
  padding-bottom: 20px;
}
```

### Routing

For display and navigation among its four pages, the application uses [Next.js App Router](https://nextjs.org/docs/app/building-your-application/routing).

Routing is defined by the directory structure.

### Authentication

For authentication, the application uses the NextAuth package.

When the database is seeded, a settings file (such as [config/settings.development.json](https://github.com/ics-software-engineering/nextjs-application-template/blob/main/config/settings.development.json)) is used to create users and stuff in the PostgreSQL database. That will lead to a default accounts being created.

The application allows users to register and create new accounts at any time.

### Authorization

Only logged in users can manipulate Stuff items (but any registered user can manipulate any Stuff item, even if they weren't the user that created it.)

### Configuration

The [config](https://github.com/ics-software-engineering/nextjs-application-template/blob/main/config) directory is intended to hold settings files. The repository contains one file: [config/settings.development.json](https://github.com/ics-software-engineering/nextjs-application-template/blob/main/config/settings.development.json).

The [.gitignore](https://github.com/ics-software-engineering/nextjs-application-template/blob/main/.gitignore) file prevents a file named settings.production.json from being committed to the repository. So, if you are deploying the application, you can put settings in a file named settings.production.json and it will not be committed.

### Quality Assurance

#### ESLint

The application includes a [.eslintrc.json](https://github.com/ics-software-engineering/nextjs-application-template/blob/main/.eslintrc.json) file to define the coding style adhered to in this application. You can invoke ESLint from the command line as follows:

```
[~/nextjs-application-template]-> npm run lint

> nextjs-application-template-1@0.1.0 lint
> next lint

✔ No ESLint warnings or errors
[~/nextjs-application-template]->
```

ESLint should run without generating any errors.

It's significantly easier to do development with ESLint integrated directly into your IDE (such as VSCode).

<!--
## Screencasts

For more information about this system, please watch one or more of the following screencasts. Note that the current source code might differ slightly from the code in these screencasts, but the changes should be very minor.

- [Walkthrough of system user interface (6 min)](https://youtu.be/48xu1hrqUi8)
- [Data and accounts structure and initialization (18 min)](https://youtu.be/HZRjwrVBWp4)
- [Navigation, routing, pages, components (34 min)](https://youtu.be/XztTdHpv6Jw)
- [Forms (32 min)](https://youtu.be/8FyWR3gUGCM)
- [Authorization, authentication, and roles (12 min)](https://youtu.be/9HX5vuXTlvA)
-->
