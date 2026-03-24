// Social Inference Engine — All website copy as typed constants.
// Update this file when application source files change (see §16 of developer guide).

export const SITE = {
  name: 'Social Inference Engine',
  tagline: 'Structured Social Intelligence for B2B Teams',
  description:
    'Open-source, locally-deployable social media intelligence platform. ' +
    'Classifies signals across 13 platforms into 10 actionable business types ' +
    'using calibrated LLM inference. Runs entirely on your machine — no SaaS, ' +
    'no data egress, no vendor lock-in.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://socialinferenceengine.com',
  repoUrl: process.env.NEXT_PUBLIC_REPO_URL ?? 'https://github.com/Shengboj0324/Inference-Engine',
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.0',
  domain: 'socialinferenceengine.com',
} as const

export const NAV = {
  links: [
    { label: 'Features', href: '/#features' },
    { label: 'How It Works', href: '/#pipeline' },
    { label: 'Benchmarks', href: '/benchmark' },
    { label: 'Documentation', href: '/docs' },
    { label: 'Changelog', href: '/changelog' },
  ],
  cta: {
    github: { label: 'Star on GitHub', href: SITE.repoUrl },
    download: { label: `Download v${SITE.appVersion}`, href: `${SITE.repoUrl}/releases/latest` },
  },
} as const

export const HERO = {
  badge: 'Open-Source · Self-Hosted · MIT License',
  headline: ['Stop reading.', 'Start acting.'],
  subheadline:
    'Social Inference Engine monitors 13 platforms, classifies every post into ' +
    '10 business-intent signal types using calibrated LLM inference, and ' +
    'delivers a prioritised action queue — running entirely on your machine.',
  ctas: {
    primary: { label: 'Get Started — Deploy in 5 minutes', href: '/docs' },
    secondary: { label: 'View on GitHub', href: SITE.repoUrl },
  },
  stats: ['593 tests passing', 'MIT License', 'Python 3.11 · FastAPI · pgvector'],
} as const

export const TRUST_BAR = [
  { number: '13', label: 'Platform connectors', icon: 'Globe' },
  { number: '10', label: 'Business signal types', icon: 'Zap' },
  { number: '593', label: 'Tests passing', icon: 'CheckCircle2' },
  { number: '< 13 µs', label: 'Per deduplication check', icon: 'Timer' },
  { number: '100%', label: 'Local — no data egress', icon: 'Shield' },
] as const

export const PROBLEM = {
  label: 'THE PROBLEM',
  heading: 'Your team is drowning in social noise.\nThe signals that matter are buried.',
  body: `B2B teams responsible for reputation, sales, and product spend hours each week manually scrolling Reddit threads, YouTube comment sections, and news feeds — searching for the posts that contain an actual signal: a prospect who just complained about a competitor, a customer whose support issue went public, a feature request pattern forming across dozens of independent posts.

Existing social listening tools surface volume, not intent. They count mentions and track sentiment. They do not tell you what to do.`,
  cards: [
    {
      icon: 'Clock',
      title: 'Hours lost to manual triage',
      body: 'A mid-size B2B team spends 3–5 hours per week reading posts that contain no actionable signal — only to miss the churn risk that surfaced in a subreddit no one was watching.',
    },
    {
      icon: 'AlertTriangle',
      title: 'Signal buried in sentiment scores',
      body: 'A post can be negative in sentiment and completely irrelevant to your business. It can be neutral in tone and contain an explicit statement of intent to switch vendors. Sentiment is the wrong unit of measurement.',
    },
    {
      icon: 'Lock',
      title: 'SaaS tools with your data',
      body: 'Every SaaS listening tool requires you to pipe your customer conversations, competitor mentions, and product feedback through a third-party server. For regulated industries, this is a compliance problem. For everyone else, it is an unnecessary risk.',
    },
  ],
} as const

export const PIPELINE_STEPS = [
  {
    icon: 'Download',
    title: 'Ingest',
    body: 'Celery workers fetch content from every configured platform connector on a 15-minute schedule. New URLs are checked against a Bloom filter before any processing begins — eliminating duplicate work without a database query.',
    tech: 'Bloom filter · O(1) deduplication · 13 µs per URL check',
  },
  {
    icon: 'Filter',
    title: 'Sample',
    body: 'When a platform returns more content than the fetch budget allows, a reservoir sampler draws a statistically unbiased sample. Every item in the stream has an equal probability of inclusion, regardless of total stream length.',
    tech: 'Reservoir sampling · O(n) · ~1,000 items/ms throughput',
  },
  {
    icon: 'Wand2',
    title: 'Normalise',
    body: 'Raw observations from 13 different platforms — each with its own schema, encoding, language, and media type — are transformed into a unified NormalizedObservation. PII is scrubbed. Non-English text is detected and flagged for translation.',
    tech: 'NormalizationEngine · DataResidencyGuard · spaCy NER',
  },
  {
    icon: 'Search',
    title: 'Retrieve',
    body: 'A candidate retrieval step finds semantically similar past observations using pgvector cosine similarity search. The top-k results are assembled into a few-shot context window passed to the LLM.',
    tech: 'pgvector · 1536-dim embeddings · HNSW approximate nearest neighbour',
  },
  {
    icon: 'Brain',
    title: 'Classify',
    body: 'The LLM Adjudicator classifies the observation against the 10-type signal taxonomy. Frontier-tier signals route to GPT-4o. The remaining 7 types route to a fine-tuned smaller model or a local Ollama model — reducing per-signal LLM cost without accuracy regression.',
    tech: 'LLMRouter · two-tier routing · calibrated confidence · abstention',
  },
  {
    icon: 'Sparkles',
    title: 'Rank and Deliver',
    body: 'Classified signals are scored across three dimensions: opportunity, urgency, and risk. The ActionRanker produces a composite priority score. The ranked queue is available via REST API, and new signals are pushed via Server-Sent Events.',
    tech: 'ActionRanker · composite priority score · SSE streaming',
  },
] as const


export const SIGNAL_TYPES = [
  {
    category: 'REVENUE OPPORTUNITIES',
    color: 'emerald',
    signals: [
      {
        slug: 'lead_opportunity',
        name: 'Lead Opportunity',
        icon: 'TrendingUp',
        description: 'A prospect publicly expressing dissatisfaction with a competitor, requesting alternatives, or describing a pain point your product solves.',
        action: 'DM Outreach',
        evidence: '"We\'ve been using [Competitor] for two years and the pricing just got unbearable. Looking for alternatives in the comments."',
      },
      {
        slug: 'competitor_weakness',
        name: 'Competitor Weakness',
        icon: 'Target',
        description: 'Public criticism, outage reports, or recurring complaints directed at a competitor that represent a window to position your product.',
        action: 'Create Content',
        evidence: '"[Competitor] has been down for 3 hours. This is the fourth time this quarter. I\'m done."',
      },
      {
        slug: 'influencer_amplification',
        name: 'Influencer Amplification',
        icon: 'Megaphone',
        description: 'A post by a high-reach account that mentions your brand, category, or a topic you can credibly enter. Time-sensitive.',
        action: 'Reply Public',
        evidence: '[YouTube creator with 420k subscribers] "I switched my entire agency workflow to this tool — here\'s why."',
      },
    ],
  },
  {
    category: 'RISK SIGNALS',
    color: 'red',
    signals: [
      {
        slug: 'churn_risk',
        name: 'Churn Risk',
        icon: 'UserMinus',
        description: 'An existing customer or user expressing frustration, threatening to cancel, or comparing your product unfavourably. Routes to the frontier LLM tier.',
        action: 'Internal Alert → DM Outreach',
        evidence: '"Three bugs in two weeks and support hasn\'t replied. I\'m moving our team off [Product] this Friday unless something changes."',
      },
      {
        slug: 'misinformation_risk',
        name: 'Misinformation Risk',
        icon: 'AlertOctagon',
        description: 'Factually incorrect claims about your product or company that are spreading in public forums. Each hour of delay increases the amplification.',
        action: 'Reply Public',
        evidence: '"[Product] was acquired by [Wrong Company] last month and they\'re shutting it down." — spreading in a 15k-member Slack community.',
      },
      {
        slug: 'support_escalation',
        name: 'Support Escalation',
        icon: 'PhoneCall',
        description: 'A support issue that has escaped private channels and is now playing out publicly on Twitter/X, Reddit, or a tech forum.',
        action: 'Reply Public + Internal Alert',
        evidence: '"@[Product] — I\'ve opened three tickets in 10 days and nobody has responded. Posting here since I have no other options."',
      },
    ],
  },
  {
    category: 'PRODUCT SIGNALS',
    color: 'violet',
    signals: [
      {
        slug: 'product_confusion',
        name: 'Product Confusion',
        icon: 'HelpCircle',
        description: 'Posts that reveal a fundamental misunderstanding of what your product does, how it works, or how it is priced.',
        action: 'Create Content',
        evidence: '"Wait — [Product] doesn\'t support [Feature]? I thought that was the whole point. We bought it specifically for that."',
      },
      {
        slug: 'feature_request_pattern',
        name: 'Feature Request Pattern',
        icon: 'Lightbulb',
        description: 'A recurring request for a specific capability appearing across multiple independent posts over a rolling window.',
        action: 'Monitor → Internal Alert',
        evidence: 'Cluster of 14 posts over 3 weeks across Reddit and Twitter all requesting native CSV export with custom date ranges.',
      },
      {
        slug: 'launch_moment',
        name: 'Launch Moment',
        icon: 'Rocket',
        description: 'A product launch — yours or a competitor\'s — generating significant public discussion. Includes pre-launch leaks and post-launch reactions.',
        action: 'Create Content + Reply Public',
        evidence: '"[Competitor] just launched [Feature] in beta. This is what everyone in our space has been waiting for."',
      },
    ],
  },
  {
    category: 'CONTENT OPPORTUNITIES',
    color: 'amber',
    signals: [
      {
        slug: 'trend_to_content',
        name: 'Trend to Content',
        icon: 'BarChart2',
        description: 'A rising conversation, topic, or question in your market that your team is credibly positioned to address with content.',
        action: 'Create Content',
        evidence: 'Rapid growth in discussions about [Technical Topic] across Hacker News and multiple engineering subreddits over the past 72 hours.',
      },
    ],
  },
] as const

export const PLATFORMS = [
  { name: 'Reddit', type: 'Social', credential: 'OAuth 2.0', coverage: 'Posts, comments, subreddit streams' },
  { name: 'YouTube', type: 'Social', credential: 'Google API key', coverage: 'Video comments, channel posts' },
  { name: 'TikTok', type: 'Social', credential: 'TikTok Developer App', coverage: 'Video comments, creator posts' },
  { name: 'Facebook', type: 'Social', credential: 'Meta Developer token', coverage: 'Page posts, public groups' },
  { name: 'Instagram', type: 'Social', credential: 'Meta Developer token', coverage: 'Post captions, comments' },
  { name: 'WeChat', type: 'Social', credential: 'WeChat Open Platform', coverage: 'Official account articles' },
  { name: 'RSS', type: 'Generic', credential: 'None — feed URLs', coverage: 'Any RSS 2.0 or Atom feed' },
  { name: 'New York Times', type: 'News', credential: 'None — public RSS', coverage: 'All section feeds' },
  { name: 'Wall Street Journal', type: 'News', credential: 'None — public RSS', coverage: 'All section feeds' },
  { name: 'ABC News (US)', type: 'News', credential: 'None — public', coverage: 'Top stories, tech, business' },
  { name: 'ABC News Australia', type: 'News', credential: 'None — public', coverage: 'Top stories, technology' },
  { name: 'Google News', type: 'News', credential: 'None — scrape', coverage: 'Top stories by topic' },
  { name: 'Apple News', type: 'News', credential: 'None — scrape', coverage: 'Top stories by topic' },
] as const

export const PRIVACY_FEATURES = [
  {
    icon: 'UserX',
    title: 'Author pseudonymisation',
    body: 'Author handles and user IDs are replaced with deterministic SHA-256 pseudonyms before any text is assembled into an LLM prompt. The mapping is stored only in your local database.',
  },
  {
    icon: 'EyeOff',
    title: 'PII scrubbing at the call boundary',
    body: 'Email addresses, phone numbers, and identifying URL parameters are removed from observation text before prompt assembly. A secondary verify_clean() check runs immediately before the API call.',
  },
  {
    icon: 'FileText',
    title: 'Immutable audit log',
    body: 'Every redaction generates a structured audit log entry with the redaction type, a hash of the original value, and a timestamp. The log is append-only and stored in your local PostgreSQL instance.',
  },
  {
    icon: 'Wifi',
    title: 'Full offline operation with Ollama',
    body: 'Configure LOCAL_LLM_URL=http://localhost:11434 and LOCAL_LLM_MODEL=llama3.1:8b to route all classification inference to a local Ollama instance. No observation text ever reaches an external network.',
  },
] as const

export const FAQ_ITEMS = [
  {
    question: 'Do I need a cloud account or SaaS subscription to run this?',
    answer: 'No. Social Inference Engine is open-source software that runs entirely on your machine. You do not need a cloud account to run the application itself. You will need an OpenAI or Anthropic API key if you want to use a hosted LLM for classification. If you configure Ollama with a local model (such as llama3.1:8b), no external account of any kind is required.',
  },
  {
    question: 'What LLM providers are supported?',
    answer: 'OpenAI (GPT-4o and GPT-4o mini), Anthropic (Claude 3.5 Sonnet and Claude 3.5 Haiku), Ollama (any locally-served model), and vLLM (self-hosted high-throughput inference). Adding a new provider requires implementing one class with two methods.',
  },
  {
    question: 'How is this different from Brandwatch, Mention, or Sprinklr?',
    answer: 'Those products are SaaS tools that ingest your data on their infrastructure and return sentiment and volume metrics. Social Inference Engine is a self-hosted application that runs on your machine, never sends your data to a third-party server (unless you configure a cloud LLM provider), and classifies posts into structured business-intent signal types. The output is an action queue, not a report.',
  },
  {
    question: 'What happens when the model is not confident enough to classify?',
    answer: 'The model abstains. It returns a structured abstention with a reason code (e.g., ambiguous_intent, insufficient_context, out_of_scope). Abstentions are logged separately and never surface in the signal queue. The abstention rate in a healthy deployment is between 5% and 15% of all observations processed.',
  },
  {
    question: 'How do I add a platform that isn\'t in the list of 13 connectors?',
    answer: 'Every connector implements the BaseConnector abstract class, which defines three methods: authenticate(), fetch(), and validate_credentials(). Implement those three methods for your platform, register the connector in app/connectors/registry.py, and add the platform name to the SourcePlatform enum in app/core/models.py.',
  },
  {
    question: 'Can I run this on Windows?',
    answer: 'Yes — via Windows Subsystem for Linux 2 (WSL2). Install WSL2, choose Ubuntu 22.04 as the distribution, and follow the Linux bare-metal installation guide. Docker Desktop for Windows with the WSL2 backend is also fully supported.',
  },
  {
    question: 'How does the calibration update work? Does it require a restart?',
    answer: 'No restart is required. Each feedback submission via POST /api/v1/signals/{id}/feedback triggers one gradient-descent step on the ConfidenceCalibrator in-process. The temperature scalar for the affected signal type is updated in memory immediately and flushed to disk. The next inference uses the updated scalar.',
  },
  {
    question: 'What database does this use? Can I use an existing PostgreSQL instance?',
    answer: 'Social Inference Engine requires PostgreSQL 15 or later with the pgvector extension installed. If you have an existing PostgreSQL 15+ instance with pgvector available, set DATABASE_URL and DATABASE_SYNC_URL in your .env file, then run python scripts/init_db.py and alembic upgrade head.',
  },
  {
    question: 'Is there a rate limit on the API?',
    answer: 'Yes. The default rate limit is 60 requests per minute per authenticated user, enforced at the API gateway layer. This can be adjusted via the RATE_LIMIT_PER_MINUTE setting in .env. The rate limit applies to all endpoints except GET /health and GET /api/v1/signals/stream.',
  },
  {
    question: 'What is the license?',
    answer: 'MIT License. You are free to use, modify, and distribute this software for any purpose, including commercial use, without restriction. The full license text is in the LICENSE file in the repository.',
  },
] as const

