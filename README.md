## Getting started
### Basic requirements
git, node.js, npm, etc...

### Angular requirements
To get all requirements for angular:
Install [angular](https://angular.io/guide/quickstart)

To install the CLI using npm, open a terminal/console window and enter the following command:
```sh
npm install -g @angular/cli
```

Clone the repository:
```sh
git clone https://gitlab.com/MAPHGruppe2/relaxful-home.git
```

Install necessary project libraries:
```sh
cd relaxful-home/app
npm install 
```

Serve the application
```sh
ng serve --open
```

Angular build tool may be required:
```sh
npm install --save-dev @angular-devkit/build-angular
```
Now available on http://localhost:4200/

## Angular apps
Angular consists of apps called components. For every new page a new app should be created.
[Generating](https://github.com/angular/angular-cli/wiki/generate-component) component:
```sh
cd relaxful-home/app
ng generate component foo
```
After this a route into `/app/src/app/app-routing.module.ts` under `children` should be added.

## CSS and responsive
[Angular flex layout](https://github.com/angular/flex-layout/wiki) - framework for building responsive layout. [Demo](https://tburleson-layouts-demos.firebaseapp.com/#/docs)

[Material design](https://material.angular.io/components/categories) - UI tools such as forms, buttons, etc...

[Tutorial](https://medium.com/letsboot/quick-start-with-angular-material-and-flex-layout-1b065aa1476c)

## GraphQL
Install [GraphQL](https://graphql.org/graphql-js)

To install the GraphQL using npm:
```sh
npm install --save graphql
```

To install the GraphQL using npm:
```sh
npm install --save graphql
```

Creating the GraphQL Server:
```sh
npm install -g graphcool-framework
```