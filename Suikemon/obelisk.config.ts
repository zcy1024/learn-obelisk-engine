import { ObeliskConfig } from '@0xobelisk/sui-common';

export const obeliskConfig = {
    name: 'Suikemon',
    description: 'Please enjoy your card drawing and pet raising journey!',
    systems: ['suikemon_system'],
    schemas: {
        backpack: {
            valueType: {
                suikemonID: 'vector<u64>',
                shiny: 'vector<bool>',
                number: 'vector<u64>'
            }
        },
        trading: {
            valueType: {
                suikemonID: 'vector<u64>',
                shiny: 'vector<bool>',
                price: 'vector<u128>',
                stock: 'vector<u64>',
                seller: 'vector<address>'
            }
        },
        collection: {
            valueType: {
                suikemonID: 'vector<u64>',
                shiny: 'vector<bool>'
            }
        }
    },
} as ObeliskConfig;
