export class ShippingOriginReq {
    constructor(
        public address: string,
        public city: string,
        public country: string,
        public stateProvince: string,
        public postalCode: string
    ) { }
}
