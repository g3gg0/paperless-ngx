import { DOCUMENT } from '@angular/common'
import { Inject, Injectable } from '@angular/core'
import { EventManager } from '@angular/platform-browser'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { Observable } from 'rxjs'
import { HotkeyDialogComponent } from '../components/common/hotkey-dialog/hotkey-dialog.component'

export interface ShortcutOptions {
  element?: any
  keys: string
  description?: string
}

@Injectable({
  providedIn: 'root',
})
export class HotKeyService {
  private defaults: Partial<ShortcutOptions> = {
    element: this.document,
  }

  private hotkeys: Map<string, string> = new Map()

  constructor(
    private eventManager: EventManager,
    @Inject(DOCUMENT) private document: Document,
    private modalService: NgbModal
  ) {
    this.addShortcut({ keys: 'shift.?' }).subscribe(() => {
      this.openHelpModal()
    })
  }

  public addShortcut(options: ShortcutOptions) {
    const optionsWithDefaults = { ...this.defaults, ...options }
    const event = `keydown.${optionsWithDefaults.keys}`

    if (optionsWithDefaults.description) {
      this.hotkeys.set(
        optionsWithDefaults.keys,
        optionsWithDefaults.description
      )
    }

    return new Observable((observer) => {
      const handler = (e: KeyboardEvent) => {
        if (
          !(e.altKey || e.metaKey || e.ctrlKey) &&
          (e.target instanceof HTMLInputElement ||
            e.target instanceof HTMLTextAreaElement)
        ) {
          // Ignore keydown events from input elements that dont have a modifier key
          return
        }

        this.modalService.dismissAll()
        if (e.key === 'Escape' && this.modalService.hasOpenModals()) {
          // If there is a modal open, just dismiss
          return
        }

        e.preventDefault()
        observer.next(e)
      }

      const dispose = this.eventManager.addEventListener(
        optionsWithDefaults.element,
        event,
        handler
      )

      let disposeMeta
      if (event.includes('control')) {
        disposeMeta = this.eventManager.addEventListener(
          optionsWithDefaults.element,
          event.replace('control', 'meta'),
          handler
        )
      }

      return () => {
        dispose()
        if (disposeMeta) disposeMeta()
        this.hotkeys.delete(optionsWithDefaults.keys)
      }
    })
  }

  private openHelpModal() {
    const modal = this.modalService.open(HotkeyDialogComponent)
    modal.componentInstance.hotkeys = this.hotkeys
  }
}