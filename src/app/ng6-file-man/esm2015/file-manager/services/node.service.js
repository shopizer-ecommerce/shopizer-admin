/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as ACTIONS from '../reducers/actions.action';
import { Store } from '@ngrx/store';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "@ngrx/store";
export class NodeService {
    /**
     * @param {?} http
     * @param {?} store
     */
    constructor(http, store) {
        this.http = http;
        this.store = store;
        this.getNodesFromServer = (path) => {
            /** @type {?} */
            let folderId = this.findNodeByPath(path).id;
            folderId = folderId === 0 ? '' : folderId;
            return this.http.get(this.tree.config.baseURL + this.tree.config.api.listFile, { params: new HttpParams().set('parentPath', folderId) });
        };
    }
    /**
     * @param {?} path
     * @return {?}
     */
    startManagerAt(path) {
        this.store.dispatch({ type: ACTIONS.SET_PATH, payload: path });
    }
    /**
     * @return {?}
     */
    refreshCurrentPath() {
        this.findNodeByPath(this.currentPath).children = {};
        this.getNodes(this.currentPath);
    }
    /**
     * @param {?} path
     * @return {?}
     */
    getNodes(path) {
        this.parseNodes(path).subscribe((data) => {
            for (let i = 0; i < data.length; i++) {
                /** @type {?} */
                const parentPath = this.getParentPath(data[i].pathToNode);
                this.findNodeByPath(parentPath).children[data[i].name] = data[i];
            }
        });
    }
    /**
     * @param {?} path
     * @return {?}
     */
    getParentPath(path) {
        /** @type {?} */
        let parentPath = path.split('/');
        parentPath = parentPath.slice(0, parentPath.length - 1);
        return parentPath.join('/');
    }
    /**
     * @param {?} path
     * @return {?}
     */
    parseNodes(path) {
        return new Observable(observer => {
            this.getNodesFromServer(path).subscribe((data) => {
                observer.next(data.map(node => this.createNode(path, node)));
                this.store.dispatch({ type: ACTIONS.SET_LOADING_STATE, payload: false });
            });
        });
    }
    /**
     * @param {?} path
     * @param {?} node
     * @return {?}
     */
    createNode(path, node) {
        if (node.path[0] !== '/') {
            console.warn('[Node Service] Server should return initial path with "/"');
            node.path = '/' + node.path;
        }
        /** @type {?} */
        const ids = node.path.split('/');
        if (ids.length > 2 && ids[ids.length - 1] === '') {
            ids.splice(-1, 1);
            node.path = ids.join('/');
        }
        /** @type {?} */
        const cachedNode = this.findNodeByPath(node.path);
        return /** @type {?} */ ({
            id: node.id,
            isFolder: node.dir,
            isExpanded: cachedNode ? cachedNode.isExpanded : false,
            pathToNode: node.path,
            pathToParent: this.getParentPath(node.path),
            name: node.name || node.id,
            children: cachedNode ? cachedNode.children : {}
        });
    }
    /**
     * @param {?} nodePath
     * @return {?}
     */
    findNodeByPath(nodePath) {
        /** @type {?} */
        const ids = nodePath.split('/');
        ids.splice(0, 1);
        return ids.length === 0 ? this.tree.nodes : ids.reduce((value, index) => value['children'][index], this.tree.nodes);
    }
    /**
     * @param {?} id
     * @return {?}
     */
    findNodeById(id) {
        /** @type {?} */
        const result = this.findNodeByIdHelper(id);
        if (result === null) {
            console.warn('[Node Service] Cannot find node by id. Id not existing or not fetched. Returning root.');
            return this.tree.nodes;
        }
        return result;
    }
    /**
     * @param {?} id
     * @param {?=} node
     * @return {?}
     */
    findNodeByIdHelper(id, node = this.tree.nodes) {
        if (node.id === id)
            return node;
        /** @type {?} */
        const keys = Object.keys(node.children);
        for (let i = 0; i < keys.length; i++) {
            if (typeof node.children[keys[i]] == 'object') {
                /** @type {?} */
                const obj = this.findNodeByIdHelper(id, node.children[keys[i]]);
                if (obj != null)
                    return obj;
            }
        }
        return null;
    }
    /**
     * @param {?} node
     * @return {?}
     */
    foldRecursively(node) {
        /** @type {?} */
        const children = node.children;
        Object.keys(children).map((child) => {
            if (!children.hasOwnProperty(child) || !children[child].isExpanded) {
                return null;
            }
            this.foldRecursively(children[child]);
            //todo put this getElById into one func (curr inside node.component.ts + fm.component.ts) - this won't be maintainable
            document.getElementById('tree_' + children[child].pathToNode).classList.add('deselected');
            children[child].isExpanded = false;
        });
    }
    /**
     * @return {?}
     */
    foldAll() {
        this.foldRecursively(this.tree.nodes);
    }
    /**
     * @return {?}
     */
    get currentPath() {
        return this._path;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set currentPath(value) {
        this._path = value;
    }
}
NodeService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] },
];
/** @nocollapse */
NodeService.ctorParameters = () => [
    { type: HttpClient },
    { type: Store }
];
/** @nocollapse */ NodeService.ngInjectableDef = i0.defineInjectable({ factory: function NodeService_Factory() { return new NodeService(i0.inject(i1.HttpClient), i0.inject(i2.Store)); }, token: NodeService, providedIn: "root" });
if (false) {
    /** @type {?} */
    NodeService.prototype.tree;
    /** @type {?} */
    NodeService.prototype._path;
    /** @type {?} */
    NodeService.prototype.getNodesFromServer;
    /** @type {?} */
    NodeService.prototype.http;
    /** @type {?} */
    NodeService.prototype.store;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmc2LWZpbGUtbWFuLyIsInNvdXJjZXMiOlsiZmlsZS1tYW5hZ2VyL3NlcnZpY2VzL25vZGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBRWhDLE9BQU8sRUFBQyxVQUFVLEVBQUUsVUFBVSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDNUQsT0FBTyxLQUFLLE9BQU8sTUFBTSw0QkFBNEIsQ0FBQztBQUN0RCxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sYUFBYSxDQUFDOzs7O0FBTWxDLE1BQU07Ozs7O0lBSUosWUFBb0IsSUFBZ0IsRUFBVSxLQUFzQjtRQUFoRCxTQUFJLEdBQUosSUFBSSxDQUFZO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBaUI7a0NBOER2QyxDQUFDLElBQVksRUFBRSxFQUFFOztZQUM1QyxJQUFJLFFBQVEsR0FBUSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUNqRCxRQUFRLEdBQUcsUUFBUSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7WUFFMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFDeEQsRUFBQyxNQUFNLEVBQUUsSUFBSSxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxFQUFDLENBQ3ZELENBQUM7U0FDSDtLQXJFQTs7Ozs7SUFHTSxjQUFjLENBQUMsSUFBWTtRQUNoQyxJQUFJLENB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QUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ25FLE1BQU0sQ0FBQyxJQUFJLENBQUM7YUFDYjtZQUVELElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7O1lBRXRDLFFBQVEsQ0FBQyxjQUFjLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzFGLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1NBQ3BDLENBQUMsQ0FBQzs7Ozs7SUFHRSxPQUFPO1FBQ1osSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOzs7OztJQUd4QyxJQUFJLFdBQVc7UUFDYixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztLQUNuQjs7Ozs7SUFFRCxJQUFJLFdBQVcsQ0FBQyxLQUFhO1FBQzNCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0tBQ3BCOzs7WUE1SUYsVUFBVSxTQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25COzs7O1lBUE8sVUFBVTtZQUVWLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4uL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1RyZWVNb2RlbH0gZnJvbSAnLi4vbW9kZWxzL3RyZWUubW9kZWwnO1xyXG5pbXBvcnQge0h0dHBDbGllbnQsIEh0dHBQYXJhbXN9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0ICogYXMgQUNUSU9OUyBmcm9tICcuLi9yZWR1Y2Vycy9hY3Rpb25zLmFjdGlvbic7XHJcbmltcG9ydCB7U3RvcmV9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuaW1wb3J0IHtBcHBTdG9yZX0gZnJvbSAnLi4vcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5JztcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIE5vZGVTZXJ2aWNlIHtcclxuICBwdWJsaWMgdHJlZTogVHJlZU1vZGVsO1xyXG4gIHByaXZhdGUgX3BhdGg6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LCBwcml2YXRlIHN0b3JlOiBTdG9yZTxBcHBTdG9yZT4pIHtcclxuICB9XHJcblxyXG4gIC8vIHRvZG8gYXNrIHNlcnZlciB0byBnZXQgcGFyZW50IHN0cnVjdHVyZVxyXG4gIHB1YmxpYyBzdGFydE1hbmFnZXJBdChwYXRoOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1BBVEgsIHBheWxvYWQ6IHBhdGh9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyByZWZyZXNoQ3VycmVudFBhdGgoKSB7XHJcbiAgICB0aGlzLmZpbmROb2RlQnlQYXRoKHRoaXMuY3VycmVudFBhdGgpLmNoaWxkcmVuID0ge307XHJcbiAgICB0aGlzLmdldE5vZGVzKHRoaXMuY3VycmVudFBhdGgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Tm9kZXMocGF0aDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLnBhcnNlTm9kZXMocGF0aCkuc3Vic2NyaWJlKChkYXRhOiBBcnJheTxOb2RlSW50ZXJmYWNlPikgPT4ge1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBwYXJlbnRQYXRoID0gdGhpcy5nZXRQYXJlbnRQYXRoKGRhdGFbaV0ucGF0aFRvTm9kZSk7XHJcbiAgICAgICAgdGhpcy5maW5kTm9kZUJ5UGF0aChwYXJlbnRQYXRoKS5jaGlsZHJlbltkYXRhW2ldLm5hbWVdID0gZGF0YVtpXTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFBhcmVudFBhdGgocGF0aDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGxldCBwYXJlbnRQYXRoID0gcGF0aC5zcGxpdCgnLycpO1xyXG4gICAgcGFyZW50UGF0aCA9IHBhcmVudFBhdGguc2xpY2UoMCwgcGFyZW50UGF0aC5sZW5ndGggLSAxKTtcclxuICAgIHJldHVybiBwYXJlbnRQYXRoLmpvaW4oJy8nKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcGFyc2VOb2RlcyhwYXRoOiBzdHJpbmcpOiBPYnNlcnZhYmxlPE5vZGVJbnRlcmZhY2VbXT4ge1xyXG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKG9ic2VydmVyID0+IHtcclxuICAgICAgdGhpcy5nZXROb2Rlc0Zyb21TZXJ2ZXIocGF0aCkuc3Vic2NyaWJlKChkYXRhOiBBcnJheTxhbnk+KSA9PiB7XHJcbiAgICAgICAgb2JzZXJ2ZXIubmV4dChkYXRhLm1hcChub2RlID0+IHRoaXMuY3JlYXRlTm9kZShwYXRoLCBub2RlKSkpO1xyXG4gICAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX0xPQURJTkdfU1RBVEUsIHBheWxvYWQ6IGZhbHNlfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNyZWF0ZU5vZGUocGF0aCwgbm9kZSk6IE5vZGVJbnRlcmZhY2Uge1xyXG4gICAgaWYgKG5vZGUucGF0aFswXSAhPT0gJy8nKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybignW05vZGUgU2VydmljZV0gU2VydmVyIHNob3VsZCByZXR1cm4gaW5pdGlhbCBwYXRoIHdpdGggXCIvXCInKTtcclxuICAgICAgbm9kZS5wYXRoID0gJy8nICsgbm9kZS5wYXRoO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGlkcyA9IG5vZGUucGF0aC5zcGxpdCgnLycpO1xyXG4gICAgaWYgKGlkcy5sZW5ndGggPiAyICYmIGlkc1tpZHMubGVuZ3RoIC0gMV0gPT09ICcnKSB7XHJcbiAgICAgIGlkcy5zcGxpY2UoLTEsIDEpO1xyXG4gICAgICBub2RlLnBhdGggPSBpZHMuam9pbignLycpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNhY2hlZE5vZGUgPSB0aGlzLmZpbmROb2RlQnlQYXRoKG5vZGUucGF0aCk7XHJcblxyXG4gICAgcmV0dXJuIDxOb2RlSW50ZXJmYWNlPntcclxuICAgICAgaWQ6IG5vZGUuaWQsXHJcbiAgICAgIGlzRm9sZGVyOiBub2RlLmRpcixcclxuICAgICAgaXNFeHBhbmRlZDogY2FjaGVkTm9kZSA/IGNhY2hlZE5vZGUuaXNFeHBhbmRlZCA6IGZhbHNlLFxyXG4gICAgICBwYXRoVG9Ob2RlOiBub2RlLnBhdGgsXHJcbiAgICAgIHBhdGhUb1BhcmVudDogdGhpcy5nZXRQYXJlbnRQYXRoKG5vZGUucGF0aCksXHJcbiAgICAgIG5hbWU6IG5vZGUubmFtZSB8fCBub2RlLmlkLFxyXG4gICAgICBjaGlsZHJlbjogY2FjaGVkTm9kZSA/IGNhY2hlZE5vZGUuY2hpbGRyZW4gOiB7fVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0Tm9kZXNGcm9tU2VydmVyID0gKHBhdGg6IHN0cmluZykgPT4ge1xyXG4gICAgbGV0IGZvbGRlcklkOiBhbnkgPSB0aGlzLmZpbmROb2RlQnlQYXRoKHBhdGgpLmlkO1xyXG4gICAgZm9sZGVySWQgPSBmb2xkZXJJZCA9PT0gMCA/ICcnIDogZm9sZGVySWQ7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoXHJcbiAgICAgIHRoaXMudHJlZS5jb25maWcuYmFzZVVSTCArIHRoaXMudHJlZS5jb25maWcuYXBpLmxpc3RGaWxlLFxyXG4gICAgICB7cGFyYW1zOiBuZXcgSHR0cFBhcmFtcygpLnNldCgncGFyZW50UGF0aCcsIGZvbGRlcklkKX1cclxuICAgICk7XHJcbiAgfTtcclxuXHJcbiAgcHVibGljIGZpbmROb2RlQnlQYXRoKG5vZGVQYXRoOiBzdHJpbmcpOiBOb2RlSW50ZXJmYWNlIHtcclxuICAgIGNvbnN0IGlkcyA9IG5vZGVQYXRoLnNwbGl0KCcvJyk7XHJcbiAgICBpZHMuc3BsaWNlKDAsIDEpO1xyXG5cclxuICAgIHJldHVybiBpZHMubGVuZ3RoID09PSAwID8gdGhpcy50cmVlLm5vZGVzIDogaWRzLnJlZHVjZSgodmFsdWUsIGluZGV4KSA9PiB2YWx1ZVsnY2hpbGRyZW4nXVtpbmRleF0sIHRoaXMudHJlZS5ub2Rlcyk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZmluZE5vZGVCeUlkKGlkOiBudW1iZXIpOiBOb2RlSW50ZXJmYWNlIHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuZmluZE5vZGVCeUlkSGVscGVyKGlkKTtcclxuXHJcbiAgICBpZiAocmVzdWx0ID09PSBudWxsKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybignW05vZGUgU2VydmljZV0gQ2Fubm90IGZpbmQgbm9kZSBieSBpZC4gSWQgbm90IGV4aXN0aW5nIG9yIG5vdCBmZXRjaGVkLiBSZXR1cm5pbmcgcm9vdC4nKTtcclxuICAgICAgcmV0dXJuIHRoaXMudHJlZS5ub2RlcztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGZpbmROb2RlQnlJZEhlbHBlcihpZDogbnVtYmVyLCBub2RlOiBOb2RlSW50ZXJmYWNlID0gdGhpcy50cmVlLm5vZGVzKTogTm9kZUludGVyZmFjZSB7XHJcbiAgICBpZiAobm9kZS5pZCA9PT0gaWQpXHJcbiAgICAgIHJldHVybiBub2RlO1xyXG5cclxuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhub2RlLmNoaWxkcmVuKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYgKHR5cGVvZiBub2RlLmNoaWxkcmVuW2tleXNbaV1dID09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgY29uc3Qgb2JqID0gdGhpcy5maW5kTm9kZUJ5SWRIZWxwZXIoaWQsIG5vZGUuY2hpbGRyZW5ba2V5c1tpXV0pO1xyXG4gICAgICAgIGlmIChvYmogIT0gbnVsbClcclxuICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBmb2xkUmVjdXJzaXZlbHkobm9kZTogTm9kZUludGVyZmFjZSkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2ZvbGRpbmcgJywgbm9kZSk7XHJcbiAgICBjb25zdCBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XHJcblxyXG4gICAgT2JqZWN0LmtleXMoY2hpbGRyZW4pLm1hcCgoY2hpbGQ6IHN0cmluZykgPT4ge1xyXG4gICAgICBpZiAoIWNoaWxkcmVuLmhhc093blByb3BlcnR5KGNoaWxkKSB8fCAhY2hpbGRyZW5bY2hpbGRdLmlzRXhwYW5kZWQpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5mb2xkUmVjdXJzaXZlbHkoY2hpbGRyZW5bY2hpbGRdKTtcclxuICAgICAgLy90b2RvIHB1dCB0aGlzIGdldEVsQnlJZCBpbnRvIG9uZSBmdW5jIChjdXJyIGluc2lkZSBub2RlLmNvbXBvbmVudC50cyArIGZtLmNvbXBvbmVudC50cykgLSB0aGlzIHdvbid0IGJlIG1haW50YWluYWJsZVxyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHJlZV8nICsgY2hpbGRyZW5bY2hpbGRdLnBhdGhUb05vZGUpLmNsYXNzTGlzdC5hZGQoJ2Rlc2VsZWN0ZWQnKTtcclxuICAgICAgY2hpbGRyZW5bY2hpbGRdLmlzRXhwYW5kZWQgPSBmYWxzZTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGZvbGRBbGwoKSB7XHJcbiAgICB0aGlzLmZvbGRSZWN1cnNpdmVseSh0aGlzLnRyZWUubm9kZXMpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGN1cnJlbnRQYXRoKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fcGF0aDtcclxuICB9XHJcblxyXG4gIHNldCBjdXJyZW50UGF0aCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLl9wYXRoID0gdmFsdWU7XHJcbiAgfVxyXG59XHJcbiJdfQ==