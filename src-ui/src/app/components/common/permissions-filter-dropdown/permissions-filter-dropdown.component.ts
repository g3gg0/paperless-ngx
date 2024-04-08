import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core'
import { first } from 'rxjs'
import { User } from 'src/app/data/user'
import {
  PermissionAction,
  PermissionType,
  PermissionsService,
} from 'src/app/services/permissions.service'
import { UserService } from 'src/app/services/rest/user.service'
import { SettingsService } from 'src/app/services/settings.service'
import { ComponentWithPermissions } from '../../with-permissions/with-permissions.component'
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap'

export class PermissionsSelectionModel {
  ownerFilter: OwnerFilterType
  hideUnowned: boolean
  userID: number
  includeUsers: number[]
  excludeUsers: number[]

  clear() {
    this.ownerFilter = OwnerFilterType.NONE
    this.userID = null
    this.hideUnowned = false
    this.includeUsers = []
    this.excludeUsers = []
  }
}

export enum OwnerFilterType {
  NONE = 0,
  SELF = 1,
  NOT_SELF = 2,
  OTHERS = 3,
  UNOWNED = 4,
  SHARED_BY_ME = 5,
}

@Component({
  selector: 'pngx-permissions-filter-dropdown',
  templateUrl: './permissions-filter-dropdown.component.html',
  styleUrls: ['./permissions-filter-dropdown.component.scss'],
})
export class PermissionsFilterDropdownComponent extends ComponentWithPermissions {
  public OwnerFilterType = OwnerFilterType

  @Input()
  title: string

  @Input()
  disabled = false

  @Input()
  selectionModel: PermissionsSelectionModel

  @Output()
  ownerFilterSet = new EventEmitter<PermissionsSelectionModel>()

  users: User[]

  hideUnowned: boolean

  @ViewChild(NgbDropdown) dropdown: NgbDropdown

  get isActive(): boolean {
    return (
      this.selectionModel.ownerFilter !== OwnerFilterType.NONE ||
      this.selectionModel.hideUnowned
    )
  }

  public isOpen(): boolean {
    return this.dropdown.isOpen()
  }

  constructor(
    public permissionsService: PermissionsService,
    userService: UserService,
    private settingsService: SettingsService
  ) {
    super()
    if (
      permissionsService.currentUserCan(
        PermissionAction.View,
        PermissionType.User
      )
    ) {
      userService
        .listAll()
        .pipe(first())
        .subscribe({
          next: (result) => (this.users = result.results),
        })
    }
  }

  reset() {
    this.selectionModel.clear()
    this.onChange()
  }

  setFilter(type: OwnerFilterType) {
    this.selectionModel.ownerFilter = type
    if (this.selectionModel.ownerFilter === OwnerFilterType.SELF) {
      this.selectionModel.includeUsers = []
      this.selectionModel.excludeUsers = []
      this.selectionModel.userID = this.settingsService.currentUser.id
      this.selectionModel.hideUnowned = false
    } else if (this.selectionModel.ownerFilter === OwnerFilterType.NOT_SELF) {
      this.selectionModel.userID = null
      this.selectionModel.includeUsers = []
      this.selectionModel.excludeUsers = [this.settingsService.currentUser.id]
      this.selectionModel.hideUnowned = false
    } else if (this.selectionModel.ownerFilter === OwnerFilterType.NONE) {
      this.selectionModel.userID = null
      this.selectionModel.includeUsers = []
      this.selectionModel.excludeUsers = []
      this.selectionModel.hideUnowned = false
    } else if (
      this.selectionModel.ownerFilter === OwnerFilterType.SHARED_BY_ME
    ) {
      this.selectionModel.userID = this.settingsService.currentUser.id
      this.selectionModel.includeUsers = []
      this.selectionModel.excludeUsers = []
      this.selectionModel.hideUnowned = false
    } else if (this.selectionModel.ownerFilter === OwnerFilterType.UNOWNED) {
      this.selectionModel.userID = null
      this.selectionModel.includeUsers = []
      this.selectionModel.excludeUsers = []
      this.selectionModel.hideUnowned = false
    }
    this.onChange()
  }

  onChange() {
    this.ownerFilterSet.emit(this.selectionModel)
  }

  onUserSelect() {
    if (this.selectionModel.includeUsers?.length) {
      this.selectionModel.ownerFilter = OwnerFilterType.OTHERS
    } else {
      this.selectionModel.ownerFilter = OwnerFilterType.NONE
    }
    this.onChange()
  }
}
