-- 研究笔记备档：科技回购潮规模有限（正文精简版 ~200 字）
insert into research_notes (hash, kind, title, body, source, industry, seg, sub, companies, tags, occurred_at, updated_at)
values ('abcd7061689d96a4d6f65cdb0ddba33b0303853a', '观点', '科技回购潮规模有限，更像监管回应，执行力度待跟踪', '10-15 盘后至 10-16，A 股科技企业集中披露 20 份回购计划、合计约 37–63 亿元，集中在光通信、PCB、存储等算力链硬件，触发自 10-10 证监会座谈会「推动有条件的上市公司加大分红回购力度」。

个人观点：规模偏小，对信心拉动有限，更像对监管指导意见的回应；多数停在「提议」阶段，且有实施周期，公告语气与实际出金可能背离，须跟踪执行力度——如宁德时代 200–400 亿元方案，实际购买偏慢。

对照：中际旭创 49.97 亿元 23 天完成，中泰证券四个月仅达下限 38.33%。', 'https://www.cls.cn/detail/xk/2507143', null, null, null, '["中际旭创", "兆易创新", "澜起科技", "新易盛", "江丰电子", "拓荆科技"]', '["股份回购", "注销式回购", "市值管理", "AI算力"]', '2026-10-16', now())
on conflict (hash) do update set kind=excluded.kind, title=excluded.title, body=excluded.body, source=excluded.source, industry=excluded.industry, seg=excluded.seg, sub=excluded.sub, companies=excluded.companies, tags=excluded.tags, occurred_at=excluded.occurred_at, updated_at=now();
