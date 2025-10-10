-- Insert initial policies data
INSERT INTO policies (slug, language_code, title, content, content_markdown) VALUES
('terms-of-service', 'en', 'Terms of Service', 'Terms of Service

Welcome to Hiwwer. These terms and conditions outline the rules and regulations for the use of Hiwwer''s Website and Services.

## Acceptance of Terms

By accessing this website and using our services, you accept these terms and conditions in full.

## Services

Hiwwer provides a platform that connects clients with digital service providers.

## User Responsibilities

Users must provide accurate information and comply with all applicable laws.

## Payment Terms

All payments are processed securely through our payment partners.

## Contact

For questions regarding these terms, please contact us at support@hiwwer.com.', 'Terms of Service

Welcome to Hiwwer. These terms and conditions outline the rules and regulations for the use of Hiwwer''s Website and Services.

## Acceptance of Terms

By accessing this website and using our services, you accept these terms and conditions in full.

## Services

Hiwwer provides a platform that connects clients with digital service providers.

## User Responsibilities

Users must provide accurate information and comply with all applicable laws.

## Payment Terms

All payments are processed securely through our payment partners.

## Contact

For questions regarding these terms, please contact us at support@hiwwer.com.'),
('terms-of-service', 'uk', 'Умови використання', 'Умови використання

Ласкаво просимо до Hiwwer. Ці умови та положення описують правила та регламент використання Веб-сайту та Послуг Hiwwer.

## Прийняття умов

Доступаючись до цього веб-сайту та використовуючи наші послуги, ви приймаєте ці умови та положення в повному обсязі.

## Послуги

Hiwwer надає платформу, що з''єднує клієнтів з постачальниками цифрових послуг.

## Відповідальність користувачів

Користувачі повинні надавати точну інформацію та дотримуватися всіх застосовних законів.

## Умови оплати

Всі платежі обробляються безпечно через наших платіжних партнерів.

## Контакти

З питаннями щодо цих умов звертайтеся до нас за адресою support@hiwwer.com.', 'Умови використання

Ласкаво просимо до Hiwwer. Ці умови та положення описують правила та регламент використання Веб-сайту та Послуг Hiwwer.

## Прийняття умов

Доступаючись до цього веб-сайту та використовуючи наші послуги, ви приймаєте ці умови та положення в повному обсязі.

## Послуги

Hiwwer надає платформу, що з''єднує клієнтів з постачальниками цифрових послуг.

## Відповідальність користувачів

Користувачі повинні надавати точну інформацію та дотримуватися всіх застосовних законів.

## Умови оплати

Всі платежі обробляються безпечно через наших платіжних партнерів.

## Контакти

З питаннями щодо цих умов звертайтеся до нас за адресою support@hiwwer.com.'),
('privacy-policy', 'en', 'Privacy Policy', 'Privacy Policy

This privacy policy explains how Hiwwer collects, uses, and protects your information.

## Information We Collect

We collect information you provide directly to us, such as when you create an account or contact us.

## How We Use Your Information

We use the information to provide, maintain, and improve our services.

## Information Sharing

We do not sell, trade, or otherwise transfer your personal information to third parties.

## Data Security

We implement appropriate security measures to protect your personal information.

## Contact Us

If you have questions about this privacy policy, contact us at privacy@hiwwer.com.', 'Privacy Policy

This privacy policy explains how Hiwwer collects, uses, and protects your information.

## Information We Collect

We collect information you provide directly to us, such as when you create an account or contact us.

## How We Use Your Information

We use the information to provide, maintain, and improve our services.

## Information Sharing

We do not sell, trade, or otherwise transfer your personal information to third parties.

## Data Security

We implement appropriate security measures to protect your personal information.

## Contact Us

If you have questions about this privacy policy, contact us at privacy@hiwwer.com.'),
('privacy-policy', 'uk', 'Політика конфіденційності', 'Політика конфіденційності

Ця політика конфіденційності пояснює, як Hiwwer збирає, використовує та захищає вашу інформацію.

## Інформація, яку ми збираємо

Ми збираємо інформацію, яку ви надаєте нам безпосередньо, наприклад, коли ви створюєте обліковий запис або зв''язуєтеся з нами.

## Як ми використовуємо вашу інформацію

Ми використовуємо інформацію для надання, підтримки та вдосконалення наших послуг.

## Обмін інформацією

Ми не продаємо, не обмінюємо та не передаємо вашу особисту інформацію третім особам.

## Безпека даних

Ми впроваджуємо відповідні заходи безпеки для захисту вашої особистої інформації.

## Зв''яжіться з нами

Якщо у вас є запитання щодо цієї політики конфіденційності, зв''яжіться з нами за адресою privacy@hiwwer.com.', 'Політика конфіденційності

Ця політика конфіденційності пояснює, як Hiwwer збирає, використовує та захищає вашу інформацію.

## Інформація, яку ми збираємо

Ми збираємо інформацію, яку ви надаєте нам безпосередньо, наприклад, коли ви створюєте обліковий запис або зв''язуєтеся з нами.

## Як ми використовуємо вашу інформацію

Ми використовуємо інформацію для надання, підтримки та вдосконалення наших послуг.

## Обмін інформацією

Ми не продаємо, не обмінюємо та не передаємо вашу особисту інформацію третім особам.

## Безпека даних

Ми впроваджуємо відповідні заходи безпеки для захисту вашої особистої інформації.

## Зв''яжіться з нами

Якщо у вас є запитання щодо цієї політики конфіденційності, зв''яжіться з нами за адресою privacy@hiwwer.com.')
ON CONFLICT (slug, language_code) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  content_markdown = EXCLUDED.content_markdown;