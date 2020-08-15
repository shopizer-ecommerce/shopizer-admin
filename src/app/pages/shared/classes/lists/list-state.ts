export class ListState {
    constructor(
        fChange: boolean,
        fReseatable: boolean,
        fString: string
      ) { 

        this.filterChange = fChange,
        this.filterResetable = fReseatable,
        this.filterString = fString

      }

    filterChange: boolean;
    filterResetable: boolean;
    filterString: string;

  }