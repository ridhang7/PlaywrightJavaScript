import {test, expect} from '../../fixtures/base';

test('Sell 10 units always reduce the holding exactly 10', async ({seededAccount, apiContext}) =>{
        const holding = seededAccount.holdings[0];
        const before = holding.quantity;
        await apiContext.post('sell',{
            data: {
                accountId: seededAccount.accountId,
                holdingId: holding.id,
                market: holding.market,
                quantity: 10,
                settlementType: 'cash',
                confirmed: true,
            },
        });
        console.log('account before sell', holding);
        const response = await apiContext.get(`account/${seededAccount.accountId}`);
        const {account } = await response.json();
        console.log('account after sell', account);
        expect(account.holdings[0].quantity).toBe(before - 10);
    })