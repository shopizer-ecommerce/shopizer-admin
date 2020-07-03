export interface NodeInterface {
    id: number;
    pathToNode: string;
    pathToParent: string;
    isFolder: boolean;
    isExpanded: boolean;
    stayOpen?: boolean;
    name?: string;
    children?: any;
}
