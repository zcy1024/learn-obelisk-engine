const Card = ({ content }: { content: string }) => {
    return (
        <div className="absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 ">
            <img className="w-40" src="/assets/bg_card.png" alt="" />
            <p className="fixed left-2/4 top-2/4 -translate-x-3/4 -translate-y-3/4 text-white">{content}</p>
        </div>
    )
};

export default Card;
