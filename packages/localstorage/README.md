# @acpaas-ui/ngx-components/localstorage

The `@acpaas-ui/ngx-components/localstorage` package allows you to easily store and retrieve data in and from your browsers storage.

## Usage

```typescript
import { LocalstorageModule } from '@acpaas-ui/ngx-components/localstorage'`;
```

## Documentation

Visit our [documentation site](https://acpaas-ui.digipolis.be/) for full how-to docs and guidelines

### Localstorage service

### API

| Name         | Default value | Description |
| -----------  | ------ | -------------------------- |
| `setItem: key: string, value: any;` | - | store an item in the localstorage and update the subscribers (all data is stringified to a JSON string). |
| `getItem: key: string;` | - | retrieve an item from the localstorage (all data is parsed from a JSON string). |
| `removeItem: key: string;` | - | remove an item from the localstorage and update the subscribers. |
| `clear: ...args;` | - | clear the localstorage. |
| `select: selector: Selector, comparator: Comparator = LocalstorageHelper.comparator` | - | get a BehaviorSubject containing the selected value. |
| `clearSubscribers: ` | - | unsubscribe all subscribers. |

### Storage type

You can set the preferred storage type in the `forRoot` method when importing the `LocalstorageModule`. The service will verify the type exists and fall back to `localStorage` by default. If `localStorage` is not available, an in-memory polyfill will be used.

### Identifier

You can provide a custom identifier that will be checked on instantiating the `LocalstorageService`. If the identifier found in the storage is different from the config, the storage will be cleared.

This way, you can invalidate your apps storage to prevent data conflicts.

### Example localstorage

```typescript
import { LocalstorageModule } from '@acpaas-ui/ngx-components/localstorage';

@NgModule({
    imports: [
        LocalstorageModule.forRoot({
            storageType: 'sessionStorage',
            identifier: 'my-app-v1',
        })
    ]
})

export class AppModule {}
```
```typescript
import { Component } from '@angular/core';
import { LocalstorageService } from '@acpaas-ui/localstorage';

interface IUser = {
    username: string;
}

@Component({
    selector: 'my-component',
    template: '...',
    providers: [ LocalstorageService ]
})
export class LocalstorageDemoPageComponent {

    public user: any;
    public item: any;

    constructor(
        private localstorageService: LocalstorageService
    ) {
        this.user = this.localstorageService.select('user');
    }

    loggedIn(): void {
        this.localstorageService.setItem('user', 'You are logged in');
    }

    loggedOut(): void {
        this.localstorageService.setItem('user', 'You are logged out');
    }

    init(): void {
        this.localstorageService.removeItem('user');
    }

    getItem(): any {
        this.item = this.localstorageService.getItem('user');
    }
}
```

## Contributing

Visit our [Contribution Guidelines](../../CONTRIBUTING.md) for more information on how to contribute.
