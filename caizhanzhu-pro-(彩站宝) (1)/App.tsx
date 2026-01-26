import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { AppView, MarketingPlan, Course } from './types';
import { MARKETING_PLANS, COURSES, NEWS, FUTURE_MODULES } from './constants';
import { generateMarketingCopy } from './services/geminiService';
import { requestWeChatPayment, isWeChatBrowser } from './services/wechatBridge'; // Import Bridge
import { 
  Megaphone, 
  PlayCircle, 
  ChevronRight, 
  Lock, 
  TrendingUp, 
  Send, 
  Copy,
  CheckCircle2,
  AlertCircle,
  Bot,
  Crown,
  X,
  CreditCard,
  ShoppingBag,
  Star,
  BookOpen
} from 'lucide-react';

// --- Shared Types & Context ---
// In a real app, this would be in a Context Provider
type UserStatus = 'FREE' | 'VIP';

// --- Components ---

const SectionHeader: React.FC<{ title: string; moreLink?: string; onClickMore?: () => void }> = ({ title, moreLink, onClickMore }) => (
  <div className="flex justify-between items-center mb-3 mt-6">
    <h2 className="text-lg font-bold text-slate-800 border-l-4 border-cai-red pl-2">{title}</h2>
    {moreLink && (
      <button onClick={onClickMore} className="text-xs text-slate-500 flex items-center">
        {moreLink === 'more' ? '查看更多' : moreLink} <ChevronRight size={14} />
      </button>
    )}
  </div>
);

const PaymentModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  item: { title: string; price: number; type: 'VIP' | 'ITEM' };
  onSuccess: () => void;
}> = ({ isOpen, onClose, item, onSuccess }) => {
  const [step, setStep] = useState<'CONFIRM' | 'PROCESSING' | 'SUCCESS' | 'ERROR'>('CONFIRM');
  const [isWeChat, setIsWeChat] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setStep('CONFIRM');
        setIsWeChat(isWeChatBrowser());
    }
  }, [isOpen]);

  const handlePay = async () => {
    setStep('PROCESSING');
    
    // Call the WeChat Bridge Service
    // In dev mode (browser), this will simulate success after 1.5s
    // In prod mode (WeChat), this would evoke the real payment window
    try {
        const success = await requestWeChatPayment({ 
            title: item.title, 
            price: item.price 
        });

        if (success) {
            setStep('SUCCESS');
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } else {
            setStep('ERROR'); // Handled loosely here, usually user cancelled
        }
    } catch (e) {
        setStep('ERROR');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl animate-slide-up">
        {step === 'CONFIRM' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">确认支付</h3>
              <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
            </div>
            <div className="text-center py-6 border-b border-slate-100">
              <p className="text-slate-500 text-sm mb-1">{item.type === 'VIP' ? '开通彩站宝VIP会员' : '购买课程/方案'}</p>
              <div className="text-3xl font-bold text-slate-900">¥ {item.price.toFixed(2)}</div>
              <p className="font-medium text-slate-800 mt-2">{item.title}</p>
            </div>
            <div className="py-4 space-y-3">
               <button className="w-full flex items-center justify-between p-3 border border-green-500 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded text-white flex items-center justify-center text-xs">微</div>
                    <span className="font-bold text-slate-700">微信支付</span>
                  </div>
                  {isWeChat && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded">推荐</span>}
                  <CheckCircle2 size={20} className="text-green-600" fill="currentColor" />
               </button>
            </div>
            <button 
              onClick={handlePay}
              className="w-full bg-green-600 text-white font-bold py-3.5 rounded-lg mt-2 active:scale-95 transition-transform"
            >
              立即支付 ¥{item.price.toFixed(2)}
            </button>
          </>
        )}

        {step === 'PROCESSING' && (
          <div className="py-10 text-center">
             <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
             <p className="font-bold text-slate-700">正在呼起微信支付...</p>
          </div>
        )}
        
        {step === 'ERROR' && (
          <div className="py-10 text-center">
             <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <X size={32} />
             </div>
             <p className="font-bold text-lg text-slate-800">支付取消或失败</p>
             <button onClick={() => setStep('CONFIRM')} className="text-sm text-slate-500 mt-2 underline">重新尝试</button>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="py-10 text-center">
             <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
             </div>
             <p className="font-bold text-lg text-slate-800">支付成功</p>
             <p className="text-sm text-slate-500">内容已为您解锁</p>
          </div>
        )}
      </div>
    </div>
  );
};

const PlanCard: React.FC<{ plan: MarketingPlan; isVip: boolean; onUnlock: () => void }> = ({ plan, isVip, onUnlock }) => {
  const isLocked = plan.isPaid && !isVip;

  return (
    <div 
      onClick={() => isLocked && onUnlock()}
      className="bg-white rounded-xl shadow-sm overflow-hidden mb-4 border border-slate-100 active:scale-[0.98] transition-transform relative"
    >
      <div className="relative h-32 bg-gray-200">
          <img src={plan.imageUrl} alt={plan.title} className={`w-full h-full object-cover ${isLocked ? 'grayscale' : ''}`} />
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              {plan.category === 'SSQ' ? '双色球' : plan.category === '3D' ? '3D' : '刮刮乐'}
          </div>
          {isLocked && (
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white backdrop-blur-[1px]">
               <Lock size={24} className="mb-1" />
               <span className="text-xs font-bold">VIP 专享</span>
            </div>
          )}
      </div>
      <div className="p-3">
        <h3 className="font-bold text-slate-800 mb-1 line-clamp-1 flex items-center gap-1">
          {plan.isPaid && <Crown size={14} className="text-cai-gold fill-cai-gold" />}
          {plan.title}
        </h3>
        <p className="text-xs text-slate-500 mb-2 line-clamp-2">{plan.description}</p>
        <div className="flex justify-between items-center text-xs">
          {plan.isPaid ? (
             <span className="text-cai-red font-bold">¥{plan.price} <span className="text-slate-400 font-normal line-through ml-1">¥29.9</span></span>
          ) : (
             <span className="text-green-600 font-bold">免费</span>
          )}
          <span className="text-slate-400">{plan.likes} 人点赞</span>
        </div>
      </div>
    </div>
  );
};

const CourseCard: React.FC<{ course: Course; isVip: boolean; onUnlock: () => void }> = ({ course, isVip, onUnlock }) => {
  // Logic: If course is free, it's unlocked. If it's paid, it needs purchase. 
  // For simplicity in this demo, VIP unlocks everything.
  const isLocked = course.isPaid && !isVip;

  return (
    <div 
      onClick={() => isLocked && onUnlock()}
      className="flex bg-white p-3 rounded-xl shadow-sm mb-4 border border-slate-100 relative overflow-hidden"
    >
      <img src={course.thumbnail} alt={course.title} className={`w-24 h-24 rounded-lg object-cover flex-shrink-0 bg-gray-200 ${isLocked ? 'grayscale opacity-70' : ''}`} />
      
      {isLocked && (
         <div className="absolute top-3 left-3 w-24 h-24 flex items-center justify-center">
            <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white">
                <Lock size={14} />
            </div>
         </div>
      )}

      <div className="ml-3 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-bold text-slate-800 text-sm line-clamp-2 flex gap-1">
             {course.isPaid && <span className="bg-cai-gold text-[10px] px-1 rounded text-white h-fit mt-0.5">精选</span>}
             {course.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1">{course.instructor}</p>
        </div>
        <div className="flex justify-between items-end mt-2">
          {course.price === 0 ? (
             <div className="text-green-600 font-bold text-sm">免费学习</div>
          ) : (
             <div className="text-cai-red font-bold">¥{course.price}</div>
          )}
          <div className="text-xs text-slate-400">{course.students}人已学</div>
        </div>
      </div>
      
      {/* Buy Button overlay for non-VIPs on paid courses */}
      {isLocked && (
        <button className="absolute bottom-3 right-3 bg-cai-red text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-sm active:scale-95">
            购买
        </button>
      )}
    </div>
  );
};

// --- Views ---

const HomeView = ({ onChangeView, isVip, triggerPayment }: { onChangeView: (v: AppView) => void; isVip: boolean; triggerPayment: (item: any) => void }) => {
  return (
    <div className="animate-fade-in">
      {/* Header Banner - Swaps based on VIP status */}
      {!isVip ? (
         <div 
            onClick={() => triggerPayment({ title: '彩站宝年度VIP会员', price: 365, type: 'VIP' })}
            className="bg-gradient-to-r from-gray-900 to-slate-800 rounded-xl p-4 text-white shadow-lg mb-6 relative overflow-hidden flex justify-between items-center"
         >
            <div>
                <h2 className="text-lg font-bold text-cai-gold flex items-center gap-2">
                    <Crown size={20} fill="currentColor" /> 开通 VIP 会员
                </h2>
                <p className="text-xs text-slate-300 mt-1">解锁全部营销方案 + 专家课程</p>
            </div>
            <button className="bg-cai-gold text-slate-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
                立即开通
            </button>
            <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-cai-gold/20 rounded-full blur-xl"></div>
         </div>
      ) : (
         <div className="bg-gradient-to-r from-cai-gold to-yellow-300 rounded-xl p-4 text-slate-900 shadow-lg mb-6 relative overflow-hidden">
             <h2 className="text-lg font-bold flex items-center gap-2">
                <Crown size={20} className="text-slate-900" /> 尊贵的 VIP 会员
            </h2>
            <p className="text-xs font-medium opacity-80 mt-1">您的权益有效期至：2025-12-31</p>
         </div>
      )}

      {/* Main functional entry - SSQ Prize */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 mb-6 flex items-center justify-between">
         <div>
            <div className="text-xs text-slate-500 mb-1">今日双色球奖池</div>
            <div className="text-2xl font-bold text-cai-red">24.5 亿</div>
         </div>
         <button 
            onClick={() => onChangeView(AppView.ASSISTANT)}
            className="bg-red-50 text-cai-red px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 active:bg-red-100"
         >
            <Bot size={16} /> 写文案
         </button>
      </div>

      {/* News Ticker */}
      <div className="bg-white rounded-lg p-3 shadow-sm mb-6 flex items-center text-sm">
        <span className="bg-red-100 text-cai-red px-2 py-0.5 rounded text-xs font-bold mr-3">公告</span>
        <div className="flex-1 truncate text-slate-600">
          {NEWS[0].title}
        </div>
        <ChevronRight size={16} className="text-slate-400" />
      </div>

      {/* Mall Entry & Features */}
      <div className="grid grid-cols-4 gap-2 mb-6">
         {FUTURE_MODULES.map((mod, idx) => (
             <button 
                key={idx} 
                onClick={() => mod.title === '彩站商城' && onChangeView(AppView.MALL)}
                className="flex flex-col items-center justify-center bg-white p-2 rounded-lg shadow-sm active:scale-95 transition-transform"
             >
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${mod.status === 'Coming Soon' ? 'bg-gray-100' : 'bg-red-50'}`}>
                    <mod.icon size={20} className={mod.status === 'Coming Soon' ? 'text-gray-400' : 'text-cai-red'} />
                 </div>
                 <span className="text-[10px] text-slate-600 font-medium text-center">{mod.title}</span>
             </button>
         ))}
      </div>

      {/* Featured Marketing */}
      <SectionHeader title="热门营销方案" moreLink="全部" onClickMore={() => onChangeView(AppView.MARKETING)} />
      <div className="grid grid-cols-1 gap-2">
        {MARKETING_PLANS.slice(0, 2).map(plan => (
            <PlanCard 
                key={plan.id} 
                plan={plan} 
                isVip={isVip} 
                onUnlock={() => triggerPayment({ title: plan.title, price: plan.price || 9.9, type: 'ITEM' })} 
            />
        ))}
      </div>

      {/* Featured Courses */}
      <SectionHeader title="精选好课" moreLink="全部" onClickMore={() => onChangeView(AppView.SKILLS)} />
      <div>
        {COURSES.slice(0, 2).map(course => (
            <CourseCard 
                key={course.id} 
                course={course} 
                isVip={isVip} 
                onUnlock={() => triggerPayment({ title: course.title, price: course.price, type: 'ITEM' })} 
            />
        ))}
      </div>
    </div>
  );
};

const MarketingView = ({ isVip, triggerPayment }: { isVip: boolean; triggerPayment: (item: any) => void }) => (
    <div className="animate-fade-in">
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {['全部', '双色球', '大乐透', '刮刮乐', '快乐8'].map((tag, i) => (
                <button key={i} className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${i === 0 ? 'bg-cai-red text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
                    {tag}
                </button>
            ))}
        </div>
        
        <div className="space-y-4">
            {MARKETING_PLANS.map(plan => (
                <PlanCard 
                    key={plan.id} 
                    plan={plan} 
                    isVip={isVip} 
                    onUnlock={() => triggerPayment({ title: plan.title, price: plan.price || 9.9, type: 'ITEM' })} 
                />
            ))}
        </div>
    </div>
);

const SkillsView = ({ isVip, triggerPayment }: { isVip: boolean; triggerPayment: (item: any) => void }) => (
    <div className="animate-fade-in">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white mb-6 flex justify-between items-center">
            <div>
                <h3 className="font-bold text-lg mb-2">业主成长学院</h3>
                <p className="text-slate-300 text-sm">实战课程 | 专家指导</p>
            </div>
            <BookOpen size={40} className="text-white/20" />
        </div>

        <SectionHeader title="最新好课" />
        {COURSES.map(course => (
            <CourseCard 
                key={course.id} 
                course={course} 
                isVip={isVip} 
                onUnlock={() => triggerPayment({ title: course.title, price: course.price, type: 'ITEM' })} 
            />
        ))}
    </div>
);

const MallView = ({ triggerPayment }: { triggerPayment: (item: any) => void }) => (
    <div className="animate-fade-in">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-5 text-white shadow-lg mb-6">
            <h2 className="text-xl font-bold mb-1">彩站商城</h2>
            <p className="opacity-90 text-sm">官方正品耗材与营销物料</p>
        </div>

        <SectionHeader title="热销耗材" />
        <div className="grid grid-cols-2 gap-3">
             {[
                 { title: '热敏打印纸 (50卷)', price: 120, img: 'https://picsum.photos/200/200?random=20' },
                 { title: '中奖喜报海报框', price: 45, img: 'https://picsum.photos/200/200?random=21' },
                 { title: '投注单收纳盒', price: 28, img: 'https://picsum.photos/200/200?random=22' },
                 { title: '号码走势图电子屏', price: 899, img: 'https://picsum.photos/200/200?random=23' },
             ].map((item, i) => (
                 <div key={i} className="bg-white p-3 rounded-lg shadow-sm border border-slate-100" onClick={() => triggerPayment({ title: item.title, price: item.price, type: 'ITEM' })}>
                     <img src={item.img} className="w-full h-32 object-cover rounded-md mb-2 bg-gray-100" />
                     <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{item.title}</h3>
                     <div className="flex justify-between items-center mt-2">
                         <span className="text-cai-red font-bold">¥{item.price}</span>
                         <span className="bg-cai-red text-white text-xs px-2 py-1 rounded-full">+</span>
                     </div>
                 </div>
             ))}
        </div>
    </div>
);

// ... (AssistantView remains largely the same, just keeping imports clean) ...
const AssistantView = () => {
    const [topic, setTopic] = useState('');
    const [tone, setTone] = useState('喜庆热情');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!topic) return;
        setLoading(true);
        setResult('');
        const text = await generateMarketingCopy(topic, tone);
        setResult(text);
        setLoading(false);
    };

    const copyToClipboard = () => {
        if(result) {
            navigator.clipboard.writeText(result);
            alert('文案已复制');
        }
    };

    return (
        <div className="animate-fade-in pb-10">
            <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-cai-red/10 p-2 rounded-full">
                        <Bot className="text-cai-red" size={24} />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">AI 营销文案助手</h2>
                        <p className="text-xs text-slate-500">输入主题，一键生成朋友圈文案</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">今日主题</label>
                        <input 
                            type="text" 
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-cai-red focus:border-cai-red outline-none"
                            placeholder="例如：双色球5亿派奖，今晚开奖..."
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">语气风格</label>
                        <div className="flex gap-2 flex-wrap">
                            {['喜庆热情', '幽默风趣', '紧急倒计时', '理性分析'].map(t => (
                                <button 
                                    key={t}
                                    onClick={() => setTone(t)}
                                    className={`px-3 py-1.5 rounded-lg text-xs border ${tone === t ? 'bg-cai-red text-white border-cai-red' : 'bg-white text-slate-600 border-slate-200'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={handleGenerate}
                        disabled={!topic || loading}
                        className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-white transition-colors ${!topic || loading ? 'bg-slate-300' : 'bg-cai-red hover:bg-cai-dark-red'}`}
                    >
                        {loading ? 'AI 正在思考...' : <><Megaphone size={18} /> 生成文案</>}
                    </button>
                </div>
            </div>

            {result && (
                <div className="bg-white rounded-xl shadow-sm p-5 border border-cai-gold/30 relative">
                    <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
                        <SparklesIcon className="text-cai-gold" /> 生成结果
                    </h3>
                    <div className="bg-slate-50 p-4 rounded-lg text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {result}
                    </div>
                    <div className="flex justify-end mt-3 gap-3">
                         <button onClick={handleGenerate} className="text-xs text-slate-500 flex items-center gap-1">
                            <Send size={14} className="rotate-180" /> 换一换
                        </button>
                        <button onClick={copyToClipboard} className="text-xs text-cai-red font-bold flex items-center gap-1">
                            <Copy size={14} /> 复制文案
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const ProfileView = ({ isVip, triggerPayment }: { isVip: boolean; triggerPayment: (item: any) => void }) => (
    <div className="animate-fade-in">
        <div className="bg-white rounded-xl p-6 flex items-center gap-4 mb-4 shadow-sm relative overflow-hidden">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 z-10">
                <img src="https://picsum.photos/100/100" alt="Avatar" className="w-full h-full rounded-full border-2 border-white shadow-md" />
            </div>
            <div className="z-10">
                <h2 className="font-bold text-lg flex items-center gap-2">
                    王站主 
                    {isVip && <span className="bg-cai-gold text-[10px] text-slate-900 px-1.5 py-0.5 rounded font-bold flex items-center gap-1"><Crown size={10} /> VIP</span>}
                </h2>
                <p className="text-xs text-slate-500">编号: 32010XXX | 信用分: 98</p>
            </div>
            {/* Decoration */}
            {isVip && <div className="absolute -right-6 -top-6 w-32 h-32 bg-cai-gold/20 rounded-full blur-2xl"></div>}
        </div>
        
        {/* VIP Upsell for Non-VIP */}
        {!isVip && (
            <div onClick={() => triggerPayment({ title: '彩站宝VIP会员', price: 365, type: 'VIP' })} className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-4 mb-4 flex justify-between items-center shadow-lg active:scale-[0.99] transition-transform">
                <div className="text-cai-gold">
                    <div className="font-bold flex items-center gap-2"><Crown size={18} fill="currentColor" /> 开通 VIP 会员</div>
                    <div className="text-xs text-slate-400 mt-1">每天仅需 1 元钱，销量翻倍</div>
                </div>
                <button className="bg-cai-gold text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full">立即开通</button>
            </div>
        )}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-slate-100">
             <div className="p-4 flex justify-between items-center active:bg-slate-50">
                <span className="text-sm font-medium flex items-center gap-3">
                    <PlayCircle size={18} className="text-blue-500" /> 我的课程
                </span>
                <ChevronRight size={16} className="text-slate-300" />
            </div>
            <div className="p-4 flex justify-between items-center active:bg-slate-50">
                <span className="text-sm font-medium flex items-center gap-3">
                    <ShoppingBag size={18} className="text-orange-500" /> 商城订单
                </span>
                <ChevronRight size={16} className="text-slate-300" />
            </div>
             <div className="p-4 flex justify-between items-center active:bg-slate-50">
                <span className="text-sm font-medium flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-cai-red" /> 站点认证
                </span>
                <ChevronRight size={16} className="text-slate-300" />
            </div>
        </div>
        
        <div className="mt-8 text-center">
            <p className="text-xs text-slate-300">彩站宝 v1.2.0</p>
        </div>
    </div>
);

// --- Helper Icon for Sparkles ---
const SparklesIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
)


// --- Main App ---

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  
  // Simulation State
  const [isVip, setIsVip] = useState(false);
  const [paymentModal, setPaymentModal] = useState<{isOpen: boolean, item: any}>({ isOpen: false, item: null });

  const triggerPayment = (item: any) => {
    setPaymentModal({ isOpen: true, item });
  };

  const handlePaymentSuccess = () => {
    if (paymentModal.item?.type === 'VIP') {
        setIsVip(true);
    }
    // In a real app, we'd add the item ID to a 'purchasedItems' list
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME: return <HomeView onChangeView={setCurrentView} isVip={isVip} triggerPayment={triggerPayment} />;
      case AppView.MARKETING: return <MarketingView isVip={isVip} triggerPayment={triggerPayment} />;
      case AppView.SKILLS: return <SkillsView isVip={isVip} triggerPayment={triggerPayment} />;
      case AppView.ASSISTANT: return <AssistantView />; // AI is free for now
      case AppView.MALL: return <MallView triggerPayment={triggerPayment} />;
      case AppView.PROFILE: return <ProfileView isVip={isVip} triggerPayment={triggerPayment} />;
      default: return <HomeView onChangeView={setCurrentView} isVip={isVip} triggerPayment={triggerPayment} />;
    }
  };

  return (
    <Layout currentView={currentView} onChangeView={setCurrentView}>
      {renderView()}
      
      {/* Global Payment Modal */}
      <PaymentModal 
         isOpen={paymentModal.isOpen} 
         onClose={() => setPaymentModal(p => ({ ...p, isOpen: false }))}
         item={paymentModal.item || { title: '', price: 0, type: 'ITEM' }}
         onSuccess={handlePaymentSuccess}
      />
    </Layout>
  );
}