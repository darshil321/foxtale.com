const Price = ({
  amount,
  className,
  currencyCode = 'INR',
  text = 'Inclusive of all tax',
  comparePrice
}: {
  amount: string;
  className?: string;
  currencyCode?: string;
  text?: string;
  comparePrice?: string;
} & React.ComponentProps<'p'>) => (
  <div className="flex flex-row items-center gap-1 md:gap-2">
    <p suppressHydrationWarning={true} className={className}>
      {`${new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currencyCode,
        currencyDisplay: 'narrowSymbol'
      }).format(parseInt(amount))}`}
    </p>
    {comparePrice && (
      <span className="ml-1 text-xl font-medium text-[#6e6e6e] line-through">₹ {comparePrice}</span>
    )}
    <span className="text-xs text-[#bcbec0] ">({text})</span>
  </div>
);

export default Price;
