use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;


declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod blog {
    use super::*;

    pub fn init_blog(ctx: Context<InitBlog>) -> ProgramResult {

        //mapping
        let blog_account= &mut ctx.accounts.blog_account;
        let genesis_post_account = &mut ctx.accounts.genesis_post_account;
        let authority= &mut ctx.accounts.authority;

        //change
        blog_account.authority=authority.key();
        blog_account.current_post_key=genesis_post_account.key();

        //result
        Ok(())
    }

    pub fn signup_user(ctx: Context<SignupUser>, name: String, avatar: String) -> ProgramResult{
        let user_account= &mut ctx.accounts.user_account;
        let authority= &mut ctx.accounts.authority;

        user_account.name=name;
        user_account.avatar=avatar;
        user_account.authority=authority.key();

        Ok(())
    }

    pub fn update_user(ctx: Context<UpdateUser>, name: String, avatar: String) -> ProgramResult {
        let user_account=&mut ctx.accounts.user_account;

        user_account.name=name;
        user_account.avatar=avatar;
        Ok(())
    }

    pub fn create_post(ctx: Context<CreatePost>, title: String, content: String) -> ProgramResult {
        let post_account=&mut ctx.accounts.post_account;
        let user_account=&mut ctx.accounts.user_account;
        let blog_account=&mut ctx.accounts.blog_account;
        let authority=&mut ctx.accounts.authority.key();

        post_account.title=title;
        post_account.content=content;
        post_account.user=user_account.key(); 
        post_account.authority=authority.key(); 
        post_account.pre_post_key=blog_account.current_post_key;

        blog_account.current_post_key=post_account.key();

        //emit event
        emit!(PostEvent{
            label: "CREATE".to_string(),
            post_id: post_account.key(),
            next_post_id: None
        });
        Ok(())
    }


    pub fn detele_post(ctx: Context<DeletePost>) -> ProgramResult{
        let post_account= &mut ctx.accounts.post_account;
        let next_post_account= &mut ctx.accounts.next_post_account;
        let authority= &mut ctx.accounts.authority;

        next_post_account.pre_post_key=post_account.pre_post_key;

        //emit
        emit!(PostEvent{
            label: "DELETE".to_string(),
            post_id: post_account.key(),
            next_post_id: Some(next_post_account.key())
        });
        
        Ok(())
    }

}


//define context
#[derive(Accounts)]
pub struct InitBlog<'info> {
    #[account(init, payer= authority, space= 8+32+32)]
    pub blog_account: Account<'info, BlogState>,
    #[account(init, payer = authority, space = 8 + 32 + 32 + 32 + 32 + 8)]
    pub genesis_post_account: Account<'info, PostState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SignupUser<'info> {
    #[account(init, payer = authority, space = 8 + 40 + 120  + 32)]
    pub user_account: Account<'info, UserState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CreatePost<'info> {
    #[account(init, payer = authority, space = 8 + 50 + 500 + 32 + 32 + 32 + 32 + 32 + 32)]
    pub post_account: Account<'info, PostState>,
    #[account(mut, has_one = authority)]
    pub user_account: Account<'info, UserState>,
    #[account(mut)]
    pub blog_account: Account<'info, BlogState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdatePost<'info> {
    #[account(
        mut,
        has_one = authority,
    )]
    pub post_account: Account<'info, PostState>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeletePost<'info> {
    #[account(
        mut,
        has_one = authority,
        close = authority,
        constraint = post_account.key() == next_post_account.pre_post_key
    )]
    pub post_account: Account<'info, PostState>,
    #[account(mut)]
    pub next_post_account: Account<'info, PostState>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeleteLatestPost<'info> {
    #[account(
        mut,
        has_one = authority,
        close = authority
    )]
    pub post_account: Account<'info, PostState>,
    #[account(mut)]
    pub blog_account: Account<'info, BlogState>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct SignupUser<'info> {
    #[account(init, payer = authority, space = 8 + 40 + 120  + 32)]
    pub user_account: Account<'info, UserState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateUser<'info> {
    #[account(
        mut,
        has_one = authority,
    )]
    pub user_account: Account<'info, UserState>,
    pub authority: Signer<'info>,
}

//define event to emit to frontend
#[event]
pub struct PostEvent {
    pub label: String,
    pub post_id: Pubkey,
    pub next_post_id: Option<Pubkey>,
}

//define account model
#[account]
pub struct BlogState{
    pub current_post_key: Pubkey, //lastest post id 
    pub authority: Pubkey, //user owns the account
}

#[account]
pub struct UserState{
    pub name: String, 
    pub avatar: String,
    pub authority: Pubkey, //owner
}

#[account]
pub struct PostState{
    pub title: String,
    pub content: String,
    pub user: Pubkey,
    pub pre_post_key: Pubkey, //create LinkedList
    pub authority: Pubkey,
}