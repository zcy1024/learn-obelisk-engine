import { ObeliskConfig } from '@0xobelisk/sui-common';

export const obeliskConfig = {
    name: 'Blackjack',
    description: 'Good Luck!',
    systems: ['blackjack_system'],
    schemas: {
        player: "u128",
        game: {
            valueType: {
                dealer: "vector<u8>",
                player: "vector<u8>"
            }
        }
    },
} as ObeliskConfig;
