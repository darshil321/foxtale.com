const Price = ({
  amount,
  className,
  currencyCode = 'INR',
  comparePrice
}: {
  amount: string;
  className?: string;
  currencyCode?: string;
  comparePrice?: string;
} & React.ComponentProps<'p'>) => {
  const isValidComparePrice = comparePrice && !isNaN(parseFloat(comparePrice));

  return (
    <div className="flex flex-row items-center gap-1 md:gap-2">
      <p suppressHydrationWarning={true} className={className}>
        {`${new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: currencyCode,
          currencyDisplay: 'narrowSymbol',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(parseFloat(amount))}`}
      </p>
      {isValidComparePrice && (
        <span className="ml-1 text-lg font-medium text-[#6e6e6e] line-through">
          ₹ {comparePrice}
        </span>
      )}
    </div>
  );
};

export default Price;
