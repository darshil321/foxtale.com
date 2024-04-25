const Price = ({
  amount,
  className,
  currencyCode = 'USD',
  text = 'Inclusive of all tax'
}: {
  amount: string;
  className?: string;
  currencyCode?: string;
  text?: string;
} & React.ComponentProps<'p'>) => (
  <div className="flex flex-row items-center gap-2">
    <p suppressHydrationWarning={true} className={className}>
      {`${new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currencyCode,
        currencyDisplay: 'narrowSymbol'
      }).format(parseFloat(amount))}`}
    </p>
    <span className="text-xs text-neutral-400 ">({text})</span>
  </div>
);

export default Price;
