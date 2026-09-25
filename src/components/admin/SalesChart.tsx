import React from 'react';

export const SalesChart: React.FC = () => {
  const months = [
    { name: 'أبريل', korean: 65, european: 35, total: '38,400' },
    { name: 'مايو', korean: 70, european: 30, total: '42,100' },
    { name: 'يونيو', korean: 75, european: 25, total: '49,800' },
    { name: 'يوليو', korean: 80, european: 20, total: '54,200' },
    { name: 'أغسطس', korean: 72, european: 28, total: '58,600' },
    { name: 'سبتمبر', korean: 78, european: 22, total: '63,900' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-outline-variant p-6 shadow-sm text-right">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-serif font-bold text-primary">
            حركة المبيعات: المستحضرات الكورية مقابل الفرنسية
          </h3>
          <p className="text-xs text-on-surface-muted mt-0.5">
            نسبة الإقبال وحجم المبيعات لفرع الموسكي والمتجر الإلكتروني
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-primary" />
            <span className="text-on-surface-variant font-medium">كوري (76%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-secondary" />
            <span className="text-on-surface-variant font-medium">فرنسي (24%)</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="space-y-4">
        {months.map((m) => (
          <div key={m.name} className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-primary font-semibold">{m.name}</span>
              <span className="text-on-surface-muted">{m.total} ج.م</span>
            </div>
            <div className="h-4 w-full bg-surface-container-low rounded-full overflow-hidden flex">
              <div
                style={{ width: `${m.korean}%` }}
                className="bg-primary h-full transition-all duration-500 relative group"
                title={`كوري: ${m.korean}%`}
              />
              <div
                style={{ width: `${m.european}%` }}
                className="bg-secondary h-full transition-all duration-500 relative group"
                title={`فرنسي: ${m.european}%`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
