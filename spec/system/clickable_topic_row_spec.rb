# frozen_string_literal: true

RSpec.describe "Clickable topic row", system: true do
  let!(:theme) { upload_theme_component }
  let!(:topic) { Fabricate(:post).topic }

  it "clicking on a topic raw navigates to the topic even when the click is not on the topic title" do
    visit("/latest")
    find("tr[data-topic-id='#{topic.id}']").click

    expect(page).to have_current_path("/t/#{topic.slug}/#{topic.id}")
  end
end
