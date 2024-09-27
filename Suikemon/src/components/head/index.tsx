import Head from 'next/head'
const Heads = () => {
    return (
        <Head>
            <title>Suikemon</title>
            <meta
                name="Suikemon"
                content="Please enjoy your card drawing and pet raising journey!"
            />
            <link rel="icon" className="rounded-full" href="/52poke.png" />
        </Head>
    )
}
export default Heads
