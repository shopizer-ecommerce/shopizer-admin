import { Component, OnInit, Input, EventEmitter, Output, ElementRef, ViewChild, ViewChildren, AfterViewInit, QueryList, Renderer2 } from '@angular/core';



@Component({
    selector: 'app-filterlistbox',
    templateUrl: './filterlistbox.component.html',
    styleUrls: ['./filterlistbox.component.scss']
})
export class FilterlistboxComponent implements OnInit, AfterViewInit {
    @ViewChildren("option") options: QueryList<ElementRef>;
    @ViewChild("inputRef", { static: false }) inputRef: ElementRef;
    @Input("itemsMap") itemsMap: Map<string, any>;
    @Input("label") label: string;
    @Input("code") code: string;
    @Input("componentId") cid: string;
    @Input("listName") listName: string;
    @Output() onKeyWordChange = new EventEmitter<Object>();
    @Input() itemStateChanged = new EventEmitter<Object>();
    @Input() selectAllEvent = new EventEmitter<Object>();
    @Input("showDelete") showDelete: boolean;
    @Output() onDeleteClicked = new EventEmitter<string>();
    search: string;
    activedescendentItem: string = null;


    constructor(private renderer: Renderer2) { }

    ngOnInit() {

        this.itemStateChanged.subscribe((data) => {
            if (data.componentId == this.cid) {
                this.inputRef.nativeElement.checked = false;
                this.activedescendentItem = null;
            }
        })
    }
    ngAfterViewInit(): void {

    }
    /**
     * Event to capture when an item is selected
     * @param $event 
     * @param item 
     */
    onSelect($event, item: any) {
        item.value.selected = item.value.selected == true ? false : true;
        this.activedescendentItem = $event.currentTarget.id;
        this.updateCurrentActiveDescendant();
        this.itemStateChanged.emit({ "componentId": this.cid, "item": item });
    }

    /**
     * This method is primarily used to update the current active descendant element so that 
     */
    updateCurrentActiveDescendant() {
        this.options.forEach((eleRef: ElementRef) => {
            if (eleRef.nativeElement.id === this.activedescendentItem) {
                this.renderer.setAttribute(eleRef.nativeElement, 'data-activedesendent', 'true');
            } else {
                this.renderer.setAttribute(eleRef.nativeElement, 'data-activedesendent', 'false');
            }
        });
    }
    /**
     * Enable keyboard accessibility via listening to key down event
     * @param $event 
     */
    onKeydown($event: any) {

        switch ($event.which) {
            case 40://Down Arrow
                this.executeArrowDown($event);
                break;

            case 38:// Up Arrow
                this.executeUpArrow($event);
                break;

            case 32:// Spacebar
                this.selectOption($event);
                break;
            case 65:// A
                this.selectAllOptionsOnKeyDown($event);
                break;
            case 36: // HOME
                this.selectFirstOption($event);
                break;
            case 35: // END
                this.selectLastOption($event);
                break;
            default:
                return
        }
    }

    /**
     * updates the current active descendent scrolls the option into view
     * @param eleRef 
     * @param index 
     * @param optionsarray 
     */
    setActiveAndScrollIntoView(eleRef: ElementRef, index: number, optionsarray: ElementRef[]) {
        this.renderer.setAttribute(eleRef.nativeElement, 'data-activedesendent', 'false');
        this.renderer.setAttribute(optionsarray[index].nativeElement, 'data-activedesendent', 'true')
        this.activedescendentItem = optionsarray[index].nativeElement.id;
        // optionsarray[index].nativeElement.scrollIntoView();
        this.scrollIntoViewSmoothly(optionsarray[index]);
    }
    /**
     * Triggered when HOME key is pressed. This sets the first option into focus
     * @param $event 
     */
    selectFirstOption($event) {
        $event.preventDefault();
        if (typeof this.activedescendentItem != "undefined" && this.activedescendentItem) {
            this.options.some((eleRef: ElementRef, index: number, optionsarray: ElementRef[]) => {
                if (eleRef.nativeElement.id === this.activedescendentItem) {
                    this.setActiveAndScrollIntoView(eleRef, 0, optionsarray);
                    return true;
                }
            });
        } else {
            this.options.some((eleRef: ElementRef, index: number, optionsarray: ElementRef[]) => {
                if (index == 0) {
                    this.setActiveAndScrollIntoView(eleRef, 0, optionsarray);
                    return true;
                }
            });
        }
    }

    scrollIntoViewSmoothly(eleRef: ElementRef) {
        eleRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }

    /**
     * Triggered when END key is pressed. This sets the first option into focus
     * @param $event 
     */
    selectLastOption($event) {
        $event.preventDefault();
        if (typeof this.activedescendentItem != "undefined" && this.activedescendentItem) {
            this.options.some((eleRef: ElementRef, index: number, optionsarray: ElementRef[]) => {
                if (eleRef.nativeElement.id === this.activedescendentItem) {
                    this.renderer.setAttribute(eleRef.nativeElement, 'data-activedesendent', 'false');
                    this.renderer.setAttribute(optionsarray[optionsarray.length - 1].nativeElement, 'data-activedesendent', 'true')
                    this.activedescendentItem = optionsarray[optionsarray.length - 1].nativeElement.id;
                    // optionsarray[optionsarray.length-1].nativeElement.scrollIntoView();
                    this.scrollIntoViewSmoothly(optionsarray[optionsarray.length - 1]);
                    return true;
                }
            });
        } else {

            this.options.some((eleRef: ElementRef, index: number, optionsarray: ElementRef[]) => {
                if (index == 0) {
                    this.renderer.setAttribute(optionsarray[optionsarray.length - 1].nativeElement, 'data-activedesendent', 'true')
                    this.activedescendentItem = optionsarray[optionsarray.length - 1].nativeElement.id;
                    //optionsarray[optionsarray.length-1].nativeElement.scrollIntoView();
                    this.scrollIntoViewSmoothly(optionsarray[optionsarray.length - 1]);
                    return true;
                }
            });
        }

    }

    /**
     * Function executes logic associated to keydown for ARROW Down. This will set the next option into focus
     * @param $event 
     */
    executeArrowDown($event: any) {
        $event.preventDefault();
        if (typeof this.activedescendentItem != "undefined" && this.activedescendentItem) {
            this.options.some((eleRef: ElementRef, index: number, optionsarray: ElementRef[]) => {
                if (eleRef.nativeElement.id === this.activedescendentItem) {
                    index = (index < optionsarray.length - 1) ? index : -1;
                    this.renderer.setAttribute(eleRef.nativeElement, 'data-activedesendent', 'false');
                    this.renderer.setAttribute(optionsarray[index + 1].nativeElement, 'data-activedesendent', 'true')
                    this.activedescendentItem = optionsarray[index + 1].nativeElement.id;
                    // optionsarray[index + 1].nativeElement.scrollIntoView();
                    this.scrollIntoViewSmoothly(optionsarray[index + 1]);
                    if ($event.shiftKey) {
                        this.updateSelectedOption(optionsarray[index + 1]);
                    }
                    return true;
                }
            });
        } else {
            this.options.some((eleRef: ElementRef, index: number, optionsarray: ElementRef[]) => {
                if (index == 0) {
                    this.renderer.setAttribute(optionsarray[index].nativeElement, 'data-activedesendent', 'true')
                    this.activedescendentItem = optionsarray[index].nativeElement.id;
                    //optionsarray[index].nativeElement.scrollIntoView();
                    this.scrollIntoViewSmoothly(optionsarray[index]);
                    if ($event.shiftKey) {
                        this.updateSelectedOption(optionsarray[index]);
                    }
                    return true;
                }
            });
        }
    }

    /**
     * Function executes logic associated to keydown for ARROW UP. This will set the previous option into focus
     * @param $event 
     */
    executeUpArrow($event: any) {
        $event.preventDefault();
        if (typeof this.activedescendentItem != "undefined" && this.activedescendentItem) {
            this.options.some((eleRef: ElementRef, index: number, optionsarray: ElementRef[]) => {
                if (eleRef.nativeElement.id === this.activedescendentItem) {
                    index = (index > 0 && index <= optionsarray.length - 1) ? index : optionsarray.length;
                    this.renderer.setAttribute(eleRef.nativeElement, 'data-activedesendent', 'false');
                    this.renderer.setAttribute(optionsarray[index - 1].nativeElement, 'data-activedesendent', 'true')
                    this.activedescendentItem = optionsarray[index - 1].nativeElement.id;
                    this.scrollIntoViewSmoothly(optionsarray[index - 1]);
                    if ($event.shiftKey) {
                        this.updateSelectedOption(optionsarray[index - 1]);
                    }
                    return true;
                }
            });
        } else {
            this.options.some((eleRef: ElementRef, index: number, optionsarray: ElementRef[]) => {
                this.renderer.setAttribute(optionsarray[optionsarray.length - 1].nativeElement, 'data-activedesendent', 'true')
                this.activedescendentItem = optionsarray[optionsarray.length - 1].nativeElement.id;
                /* optionsarray[optionsarray.length - 1].nativeElement.scrollIntoView(); */
                this.scrollIntoViewSmoothly(optionsarray[optionsarray.length - 1]);
                if ($event.shiftKey) {
                    this.updateSelectedOption(optionsarray[optionsarray.length - 1]);
                }
                return true;
            });
        }
    }
    /**
     * Function executes logic associated to keydown of Spacebar. This will select the current active-descendent i.e., focused option
     * @param $event 
     */
    selectOption($event: any) {
        if (typeof this.activedescendentItem != "undefined" && this.activedescendentItem) {
            this.options.some((eleRef: ElementRef, index: number, optionsarray: ElementRef[]) => {
                if (eleRef.nativeElement.id === this.activedescendentItem) {
                    this.updateSelectedOption(eleRef);
                    return true;
                }
            });
        }
    }
    /**
     * Utility fuction which will update the state of the option's model i.e.,selected/unselected
     * @param eleRef 
     */
    updateSelectedOption(eleRef: ElementRef) {
        let code = eleRef.nativeElement.getAttribute("data-code");
        let item = this.itemsMap.get(code);
        item.selected = (item.selected) ? false : true;
        this.itemsMap.set(code, item);
    }
    /**
     * Triggers for CTRL+A which will either select all/unselect all based on current state
     * @param $event 
     */
    selectAllOptionsOnKeyDown($event: any) {
        $event.preventDefault();
        if ($event.ctrlKey === true) {
            if (this.inputRef.nativeElement.checked == false) {
                this.iterateAndSetSelectedStatus(true);
                this.inputRef.nativeElement.checked = true;
            } else {
                this.iterateAndSetSelectedStatus(false);
                this.inputRef.nativeElement.checked = false;
            }

        }
    }
    /**
     * Triggered when select all checkbox state is changed
     * @param $event 
     */
    selectOrUnselectAll($event: any) {
        this.iterateAndSetSelectedStatus($event.currentTarget.checked);
    }
    /**
     * Common utility function which sets the model object value to desired state i.e., selected=true or false
     * @param selected 
     */
    iterateAndSetSelectedStatus(selected: boolean) {
        this.itemsMap.forEach((item: any, key: string) => {
            item.selected = selected;
        });
    }


}




