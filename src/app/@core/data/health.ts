export interface Health {
    status: string,
    components: {
        db: {
            status: string,
            details: {
                database: string,
                validationQuery: string,
                result: number
            }
        },
        diskSpace: {
            status: string,
            details: {
                total: number,
                free: number,
                threshold: number,
                exists: boolean
            }
        },
        elasticsearch: {
            status: string,
            details: {
                error: string
            }
        },
        livenessState: {
            status: string
        },
        mail: {
            status: string,
            details: {
                location: string,
                error: string
            }
        },
        ping: {
            status: string
        },
        readinessState: {
            status: string
        }
    },
    groups: string[]
}