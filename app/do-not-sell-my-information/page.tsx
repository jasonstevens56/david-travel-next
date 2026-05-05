import Header from '@/components/Header'
import Footer from '@/components/Footer'

const paragraphs = ["Do Not Sell My Personal Information", "Your right to opt out of sale of your personal information", "Under the California Consumer Privacy Act of 2018 (CCPA), beginning January 1, 2020, California residents have the right to opt out of the sale of personal information about them or their household, such as (though not limited to) their name, postal or email address, and other personally identifying information. You need not be physically present in California to exercise this right provided that you have a current California residence.", "This right is subject to certain exemptions. For example, the law does not apply to information that has been aggregated and/or de-identified such that it could not reasonably be used to identify you. It also does not apply to information that we share with third-party service providers in order for them to perform certain business functions for us.", "How to exercise your opt-out rights or other California privacy rights", "If you would like to exercise any of your rights provided by the CCPA, such as the right to access or delete your personal information, or to opt out of the sale or future sale of your personal information you or your authorized agent or representative may contact us via the following methods:", "Email:\u00a0privacy@daviddottravel.com", "Postal Mail:", "Crunching Data LLC", "1309 Coffeen Avenue", "Suite 1200", "Sheridan, Wyoming 82801", "There is no charge for making privacy-related requests.", "Please note that, in order to better safeguard your privacy and the privacy of others, we may be required to verify your identity before processing certain data-related requests.", "In some cases, we may be unable to fulfill your request because we have no way to verify your identity to the standard the law and/or its associated regulations require. For example (but without limitation), if you have visited our website, but never registered as a user, or applied for a job, or interacted with us via email or other means, we probably do not have enough information to confirm your identity to even a \u201creasonable degree of certainty\u201d (as the applicable regulations may define that term). Also, in addition to any other exemptions applicable law and/or regulation may provide to your rights under the CCPA (particularly with regard to the deletion of your personal information), we may be unable to delete certain information (e.g., our web host\u2019s server and error logs) for technical reasons.", "As with the right to opt out, the other rights provided by the CCPA are subject to certain exemptions and exceptions, as specified in the applicable federal statutes and/or associated regulations issued by California\u2019s Office of the Attorney General. Those statues and/or regulations may also stipulate the maximum time allowed for acknowledging and responding to a request. There is no charge for making privacy-related requests.", "Only you, or a person registered with the California Secretary of State that you authorize to act on your behalf, may make a verifiable consumer request related to your personal information.", "You may only make a verifiable consumer request for access or data portability twice within a 12-month period. The verifiable consumer request must:", "Provide sufficient information that allows us to reasonably verify you are the person about whom we collected personal information or an authorized representative; and", "Describe your request with sufficient detail that allows us to properly understand, evaluate, and respond to it.", "We cannot respond to your request or provide you with personal information if we cannot verify your identity or authority to make the request and confirm the personal information relates to you. Making a verifiable consumer request does not require you to create an account with us. However, we do consider requests made through your password protected account sufficiently verified when the request relates to personal information associated with that specific account.", "We will only use personal information provided in a verifiable consumer request to verify the requestor\u2019s identity or authority to make the request.", "Last Updated May 5, 2026"]

export const metadata = {
  title: 'Do Not Sell My Personal Information | David Travel',
}

export default function Page() {
  return (
    <>
      <Header />
      <main className="page-main">
        <article className="page-card">
          <h1>Do Not Sell My Personal Information</h1>
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </article>
      </main>
      <Footer />
    </>
  )
}
