import { useEffect, useState, useContext, Dispatch, SetStateAction } from "react";

import { NETWORK, PACKAGE_ID, WORLD_ID } from '../../chain/config';
import { loadMetadata, Obelisk, Transaction, TransactionResult } from '@0xobelisk/sui-client';
import { useCurrentAccount } from "@mysten/dapp-kit";
import { PRIVATEKEY } from "../../chain/key";

import Card from "../../components/card";
import Hand from "../../components/hand";
import Settlement from "../../components/settlement";
import { Balance, Mask } from "..";

const Home = ({ isNewUser }: { isNewUser: boolean }) => {
    const account = useCurrentAccount()

    const [play, setPlay] = useState<boolean>(false)
    const [playerOver, setPlayerOver] = useState<boolean>(false)
    const [playerPoints, setPlayerPoints] = useState<number>(0)
    const [gameOver, setGameOver] = useState<string>("")
    const bet = 666666
    const [ready, setReady] = useState<boolean>(false)

    const startGame = () => {
        if (isNewUser || !ready)
            return
        setPlay(true)
        setPlayerOver(false)
        setPlayerPoints(0)
    }

    const [balance, _] = useContext(Balance)
    const setIsMasked = useContext(Mask)
    const playGame = async () => {
        const metadata = await loadMetadata(NETWORK, PACKAGE_ID)
        const obelisk = new Obelisk({
            networkType: NETWORK,
            packageId: PACKAGE_ID,
            metadata: metadata,
            secretKey: PRIVATEKEY
        })
        const tx = new Transaction();
        const world = tx.object(WORLD_ID);
        const random = tx.object("0x8")
        const tx_bet = tx.pure.u128(bet)
        const player = tx.pure.address(account.address)
        const params = [world, random, tx_bet, player];
        (await obelisk.tx.blackjack_system.play_game(tx, params, undefined, true)) as TransactionResult;
        await obelisk.signAndSendTxn(tx);
        setReady(true)
    }

    const oneMoreRound = async () => {
        setIsMasked(true)
        setReady(false)
        if (balance >= bet)
            await playGame()
        setPlay(false)
        setGameOver("")
        setIsMasked(false)
    }

    useEffect(() => {
        if (balance < bet)
            return
        if (!isNewUser && !play)
            playGame()
    }, [isNewUser, balance])

    return (
        <>
            <Card content="?" playing={play} startGame={startGame} />
            {
                play
                &&
                <>
                    <Hand identity="player" playerOver={playerOver} setPlayerOver={setPlayerOver} setPlayerPoints={setPlayerPoints} setGameOver={setGameOver} bet={bet} />
                    <Hand identity="enemy" playerOver={playerOver} setPlayerOver={setPlayerOver} playerPoints={playerPoints} gameOver={gameOver} setGameOver={setGameOver} />
                </>
            }
            { gameOver && <Settlement result={gameOver} oneMoreRound={oneMoreRound} bet={bet} /> }
        </>
    )
};

export default Home;
