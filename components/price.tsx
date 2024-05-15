const Price = ({
  amount,
  className,
  currencyCode = 'INR',
  text = 'Inclusive of all tax'
}: {
  amount: string;
  className?: string;
  currencyCode?: string;
  text?: string;
} & React.ComponentProps<'p'>) => (
  <div className="flex flex-row items-center gap-1 md:gap-2">
    <p suppressHydrationWarning={true} className={className}>
      {`${new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currencyCode,
        currencyDisplay: 'narrowSymbol'
      }).format(parseFloat(amount))}`}
    </p>
    <span className="text-xs text-[#bcbec0] ">({text})</span>
  </div>
);

export default Price;
