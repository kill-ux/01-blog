# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.



src/
├── app/
│   ├── core/                          # Singleton services, guards, interceptors
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── admin.guard.ts
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts
│   │   │   ├── error.interceptor.ts
│   │   │   └── loading.interceptor.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── storage.service.ts
│   │   │   ├── api.service.ts
│   │   │   └── notification.service.ts
│   │   └── core.module.ts
│   │
│   ├── shared/                        # Shared components, pipes, directives
│   │   ├── components/
│   │   │   ├── loading-spinner/
│   │   │   ├── confirm-dialog/
│   │   │   ├── pagination/
│   │   │   └── search-bar/
│   │   ├── pipes/
│   │   │   ├── truncate.pipe.ts
│   │   │   └── time-ago.pipe.ts
│   │   ├── directives/
│   │   │   ├── autofocus.directive.ts
│   │   │   └── click-outside.directive.ts
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   ├── blog.model.ts
│   │   │   └── api-response.model.ts
│   │   ├── utils/
│   │   │   ├── constants.ts
│   │   │   └── helpers.ts
│   │   └── shared.module.ts
│   │
│   ├── features/                      # Feature modules (Lazy loaded)
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── services/
│   │   │   │   └── auth-api.service.ts
│   │   │   ├── auth-routing.module.ts
│   │   │   └── auth.module.ts
│   │   ├── blog/
│   │   │   ├── components/
│   │   │   │   ├── blog-list/
│   │   │   │   ├── blog-detail/
│   │   │   │   ├── blog-form/
│   │   │   │   └── blog-card/
│   │   │   ├── services/
│   │   │   │   └── blog-api.service.ts
│   │   │   ├── blog-routing.module.ts
│   │   │   └── blog.module.ts
│   │   ├── user/
│   │   │   ├── profile/
│   │   │   ├── settings/
│   │   │   ├── services/
│   │   │   ├── user-routing.module.ts
│   │   │   └── user.module.ts
│   │   └── admin/
│   │       ├── dashboard/
│   │       ├── user-management/
│   │       ├── services/
│   │       ├── admin-routing.module.ts
│   │       └── admin.module.ts
│   │
│   ├── layouts/                       # Layout components
│   │   ├── header/
│   │   │   ├── header.component.ts
│   │   │   ├── header.component.html
│   │   │   └── header.component.scss
│   │   ├── footer/
│   │   └── main-layout/
│   │
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── app-routing.module.ts
│   ├── app.component.ts
│   └── app.module.ts
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── styles/
└── styles/
    ├── _variables.scss
    ├── _mixins.scss
    └── styles.scss